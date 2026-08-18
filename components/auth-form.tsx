import { useState, useContext, useEffect, Suspense } from "react";
import { useMutation } from "@tanstack/react-query";
import { useSearchParams } from "next/navigation";
import { AuthContext } from "@/app/providers";
import { registerUser, loginUser } from "@/lib/auth";
import Alert from "@/components/alert";
import { User } from "@/types/proglv";
import GenericButton from "./generic-button";
import AuthField from "./auth-field";
import { IconEye, IconEyeOff, IconLogin2, IconUserPlus } from "@tabler/icons-react";
import { TextLink } from "./text-link";
import Link from "next/link";

function FormatError(error: string) {
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
        } as User);

        setIsRedirecting(true);
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

  const disableInputs =
    loginMutation.status === "pending" ||
    registerMutation.status === "pending" ||
    isRedirecting;

  return (
    <div className="flex w-full flex-col gap-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-[1.75rem] font-normal leading-tight tracking-tight text-[#161616]">
          {type === "register" ? "Izveidot kontu" : "Pieslēgties"}
        </h1>
        <Suspense>
          <GoToLoginOrRegister
            type={type}
            redirect={redirectParam ?? undefined}
            onSwitchToLogin={onSwitchToLogin}
            onSwitchToRegister={onSwitchToRegister}
          />
        </Suspense>
      </div>

      <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
        <AuthField
          label="Lietotājvārds"
          name="username"
          autoComplete="username"
          required
          disabled={disableInputs}
          value={username}
          onChange={setUsername}
        />

        {type === "register" && (
          <>
            <div className="flex flex-col gap-4 sm:flex-row sm:gap-3">
              <div className="flex-1">
                <AuthField
                  label="Vārds (neobligāts)"
                  name="firstName"
                  disabled={disableInputs}
                  value={firstName}
                  onChange={setFirstName}
                />
              </div>
              <div className="flex-1">
                <AuthField
                  label="Uzvārds (neobligāts)"
                  name="lastName"
                  disabled={disableInputs}
                  value={lastName}
                  onChange={setLastName}
                />
              </div>
            </div>
            <AuthField
              label="E-pasta adrese"
              name="email"
              type="email"
              autoComplete="email"
              disabled={disableInputs}
              value={email}
              onChange={setEmail}
            />
          </>
        )}

        <div className="flex flex-col gap-1.5">
          <AuthField
            label="Parole"
            name="password"
            autoComplete={
              type === "register" ? "new-password" : "current-password"
            }
            required
            disabled={disableInputs}
            type={isVisible ? "text" : "password"}
            value={password}
            onChange={setPassword}
            endContent={
              <button
                type="button"
                className="p-1 text-[#525252] hover:text-[#161616]"
                aria-label={isVisible ? "Slēpt paroli" : "Rādīt paroli"}
                onMouseDown={toggleVisibility}
              >
                {isVisible ? <IconEyeOff size={20} /> : <IconEye size={20} />}
              </button>
            }
          />
          {type === "login" && (
            <p className="text-xs text-[#6f6f6f]">
              <Link
                href="/forgot-password"
                className="text-[#6f6f6f] underline underline-offset-2 decoration-[#6f6f6f]/35 hover:text-[#525252] hover:decoration-[#525252]/70"
              >
                Aizmirsi paroli?
              </Link>
            </p>
          )}
        </div>

        {type === "register" && (
          <AuthField
            label="Apstipriniet paroli"
            name="confirmPassword"
            type="password"
            autoComplete="new-password"
            required
            disabled={disableInputs}
            value={repPassword}
            onChange={setRepPassword}
          />
        )}

        {error && (
          <Alert message={error} type="error" onClose={() => setError(null)} />
        )}

        <GenericButton
          className="mt-2"
          fullWidth
          variant={type === "register" ? "success" : "primary"}
          icon={
            type === "register" ? (
              <IconUserPlus size={20} stroke={1.75} />
            ) : (
              <IconLogin2 size={20} stroke={1.75} />
            )
          }
          isLoading={
            loginMutation.status === "pending" ||
            registerMutation.status === "pending" ||
            isRedirecting
          }
          type="submit"
        >
          {type === "register" ? "Reģistrēties" : "Turpināt"}
        </GenericButton>
      </form>
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
    <p className="text-sm text-[#525252]">
      {type === "register" ? (
        <>
          Jau ir konts?{" "}
          {onSwitchToLogin ? (
            <button
              type="button"
              className="cursor-pointer border-0 bg-transparent p-0 font-medium text-blue-800 underline underline-offset-2 decoration-blue-800/30 hover:decoration-blue-800/90"
              onClick={onSwitchToLogin}
            >
              Pieslēgties
            </button>
          ) : (
            <TextLink color="primary" weight="medium" href={loginHref}>
              Pieslēgties
            </TextLink>
          )}
        </>
      ) : (
        <>
          Nav konta?{" "}
          {onSwitchToRegister ? (
            <button
              type="button"
              className="cursor-pointer border-0 bg-transparent p-0 font-medium text-[#8a3ffc] underline underline-offset-2 decoration-[#8a3ffc]/30 hover:decoration-[#8a3ffc]/90"
              onClick={onSwitchToRegister}
            >
              Reģistrēties
            </button>
          ) : (
            <TextLink color="accent" weight="medium" href={registerHref}>
              Reģistrēties
            </TextLink>
          )}
        </>
      )}
    </p>
  );
}
