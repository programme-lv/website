import { useState, useContext, useEffect } from "react";
import { useMutation } from "@tanstack/react-query";
import { useSearchParams } from "next/navigation";
import { AuthContext } from "@/app/providers";
import { registerUser, loginUser } from "@/lib/auth";
import Alert from "@/components/alert";
import { Suspense } from "react";
import { User } from "@/types/proglv";
import GenericButton from "./generic-button";
import { IconEye, IconEyeOff, IconLogin2, IconUserPlus } from "@tabler/icons-react";
import { TextLink } from "./text-link";
import { Input, Label } from "@heroui/react";


function FormatError(error: string) {
  // capitalize first letter
  // add dot at the end
  return error.charAt(0).toUpperCase() + error.slice(1) + ".";
}

type AuthFormProps = {
  type: "login" | "register";
  redirect?: string;
  /** When set (e.g. in AuthModal), login/register footer switches view instead of navigating. */
  onSwitchToLogin?: () => void;
  onSwitchToRegister?: () => void;
};

export default function AuthForm({
  type,
  redirect,
  onSwitchToLogin,
  onSwitchToRegister,
}: AuthFormProps) {
  const searchParams = useSearchParams();
  const redirectParam = redirect ?? searchParams.get("redirect");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [repPassword, setRepPassword] = useState("");
  const authContext = useContext(AuthContext);
  const [isVisible, setIsVisible] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const toggleVisibility = () => setIsVisible(!isVisible);
  const [isRedirecting, setIsRedirecting] = useState(false);

  useEffect(() => {
    setError(null);
  }, [type]);

  const registerMutation = useMutation({
    mutationFn: registerUser,
    onMutate: () => {
      setError(null);
    },
    onSuccess: async (response) => {
      if (response.status === "success") {
        setIsRedirecting(true);
        loginMutation.mutate({ username, password });
      } else {
        setError(FormatError(response.message));
      }
    },
    onError: (error) => {
      alert("Registration error: " + JSON.stringify(error));
    },
  });

  const loginMutation = useMutation({
    mutationFn: loginUser,
    onMutate: () => {
      setError(null);
    },
    onSuccess: async (response) => {
      if (response.status === "success") {
        const user = response.data;

        authContext.setUser({
          uuid: user.uuid,
          username: user.username,
          email: user.email,
          firstname: user.firstname,
          lastname: user.lastname,
        } as User)

        setIsRedirecting(true);

        // Use hard navigation to ensure server components re-fetch data with new auth state
        window.location.href = redirectParam || "/tasks";
      } else {
        setError(FormatError(response.message));
      }
    },
    onError: async (response) => {
      setError(FormatError(response.message));
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (type === "register") {
      if (password !== repPassword) {
        setError("Paroles nesakrīt!");

        return;
      }
      registerMutation.mutate({
        username,
        email,
        password,
        firstname: firstName,
        lastname: lastName,
      });
    } else {
      loginMutation.mutate({ username, password });
    }
  };

  const disableInputs = loginMutation.status === 'pending' || registerMutation.status === 'pending' || isRedirecting;

  return (
    <div className="flex w-full flex-col gap-4 pb-4 pt-4">
      <p className="pb-2 text-xl flex gap-x-2">
        {type === "register" ? (
          <>
            <span>Reģistrācija</span>
          </>
        ) : (
          <>Sveicināts!</>
        )}
      </p>
      <form className="flex flex-col gap-6" onSubmit={handleSubmit}>
        <div className="flex flex-col gap-1">
          <Label>Lietotājvārds</Label>
          <Input
            aria-label="Lietotājvārds"
            autoComplete="username"
            className="border-divider border rounded-md py-3"
            disabled={disableInputs}
            name="username"
            required
            value={username}
            variant="secondary"
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setUsername(e.target.value)}
          />
        </div>
        {type === "register" && (
          <>
            <div className="flex flex-col md:flex-row gap-3">
              <div className="flex flex-1 flex-col gap-1">
                <Label>Vārds (neobligāts)</Label>
                <Input
                  aria-label="Vārds (neobligāts)"
                  className="border-divider border rounded-md py-3"
                  disabled={disableInputs}
                  name="firstName"
                  value={firstName}
                  variant="secondary"
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFirstName(e.target.value)}
                />
              </div>
              <div className="flex flex-1 flex-col gap-1">
                <Label>Uzvārds (neobligāts)</Label>
                <Input
                  aria-label="Uzvārds (neobligāts)"
                  className="border-divider border rounded-md py-3"
                  disabled={disableInputs}
                  name="lastName"
                  value={lastName}
                  variant="secondary"
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setLastName(e.target.value)}
                />
              </div>
            </div>
            <div className="flex flex-col gap-1">
              <Label>E-pasta adrese</Label>
              <Input
                aria-label="E-pasta adrese"
                autoComplete="email"
                className="border-divider border rounded-md py-3"
                disabled={disableInputs}
                name="email"
                type="email"
                value={email}
                variant="secondary"
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
              />
            </div>
          </>
        )}
        <div className="flex flex-col md:flex-row gap-3">
          <div className="flex flex-1 flex-col gap-1">
            <Label>Parole</Label>
            <div className="relative">
              <Input
                aria-label="Parole"
                autoComplete="password"
                className="border-divider border rounded-md py-3 pr-10"
                disabled={disableInputs}
                name="password"
                required
                fullWidth
                type={isVisible ? "text" : "password"}
                value={password}
                variant="secondary"
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}
              />
              <div className="pointer-events-auto absolute inset-y-0 right-3 flex items-center">
                <button type="button" onMouseDown={toggleVisibility}>
                  {isVisible ? (
                    <IconEyeOff className="text-default-500" size={22}
                    />
                  ) : (
                    <IconEye className="text-default-500" size={22} />
                  )}
                </button>
              </div>
            </div>
          </div>
          {type === "register" && (
            <div className="flex flex-1 flex-col gap-1">
              <Label>Apstipriniet paroli</Label>
              <Input
                aria-label="Apstipriniet paroli"
                autoComplete="new-password"
                className="border-divider border rounded-md py-3"
                disabled={disableInputs}
                name="confirmPassword"
                required
                type="password"
                value={repPassword}
                variant="secondary"
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setRepPassword(e.target.value)}
              />
            </div>
          )}
        </div>
        <div className="flex justify-center">
          <GenericButton
            rounded="lg"
            variant={type === "register" ? "success" : "primary"}
            icon={type === "register" ? <IconUserPlus size={22} /> : <IconLogin2 size={22} />}
            className="w-full"
            isLoading={
              loginMutation.status === 'pending' ||
              registerMutation.status === 'pending' ||
              isRedirecting
            }
            type="submit"
          >
            {type === "register" ? "Reģistrēties" : "Pieslēgties"}
          </GenericButton>
          {/* <Button
            className="flex-grow mt-4"
            color="primary"
            isLoading={
              loginMutation.status === 'pending' ||
              registerMutation.status === 'pending' ||
              isRedirecting
            }
            type="submit"
          >
            {type === "register" ? "Reģistrēties" : "Pieslēgties"}
          </Button> */}
        </div>
      </form>

      {error && (
        <Alert message={error} type="error" onClose={() => setError(null)} />
      )}
      <div className="flex items-center gap-4 py-2">
        <div className="flex-1 border-t border-divider" />
        <p className="shrink-0 text-small text-default-500">VAI</p>
        <div className="flex-1 border-t border-divider" />
      </div>
      <Suspense>
        <GoToLoginOrRegister
          type={type}
          redirect={redirectParam ?? undefined}
          onSwitchToLogin={onSwitchToLogin}
          onSwitchToRegister={onSwitchToRegister}
        />
      </Suspense>
    </div>
  );
}

function GoToLoginOrRegister({
  type,
  redirect,
  onSwitchToLogin,
  onSwitchToRegister,
}: {
  type: "login" | "register";
  redirect?: string;
  onSwitchToLogin?: () => void;
  onSwitchToRegister?: () => void;
}) {
  const searchParams = useSearchParams();
  const redirectParam = redirect ?? searchParams.get("redirect");

  const loginHref = redirectParam
    ? `/login?redirect=${encodeURIComponent(redirectParam)}`
    : `/login`;
  const registerHref = redirectParam
    ? `/register?redirect=${encodeURIComponent(redirectParam)}`
    : `/register`;

  return (
    <p className="text-center text-small">
      {type === "register" ? (
        <>
          Jau ir konts?&nbsp;
          {onSwitchToLogin ? (
            <button
              type="button"
              className="cursor-pointer border-0 bg-transparent p-0 text-blue-800 underline underline-offset-2 decoration-blue-800/30 hover:decoration-blue-800/90 font-medium"
              onClick={onSwitchToLogin}
            >
              Pieslēgties
            </button>
          ) : (
            <TextLink color="default" weight="medium" href={loginHref}>
              Pieslēgties
            </TextLink>
          )}
        </>
      ) : (
        <>
          Nav konta?&nbsp;
          {onSwitchToRegister ? (
            <button
              type="button"
              className="cursor-pointer border-0 bg-transparent p-0 text-green-700 underline underline-offset-2 decoration-green-700/30 hover:decoration-green-700/90 font-medium"
              onClick={onSwitchToRegister}
            >
              Reģistrēties
            </button>
          ) : (
            <TextLink color="success" weight="medium" href={registerHref}>
              Reģistrēties
            </TextLink>
          )}
        </>
      )}
    </p>
  );
}
