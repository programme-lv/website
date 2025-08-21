import { useState, useContext } from "react";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useSearchParams } from "next/navigation";
import { AuthContext } from "@/app/providers";
import { registerUser, loginUser } from "@/lib/auth";
import Alert from "@/components/alert";
import { Divider, Input } from "@heroui/react";
import { Icon } from "@iconify/react";
import Link from "next/link";
import { Suspense } from "react";
import { User } from "@/types/proglv";
import GenericButton from "./generic-button";
import { IconLogin2, IconUserPlus } from "@tabler/icons-react";
import { TextLink } from "./text-link";


function FormatError(error: string) {
  // capitalize first letter
  // add dot at the end
  return error.charAt(0).toUpperCase() + error.slice(1) + ".";
}

export default function AuthForm({ type, redirect }: { type: "login" | "register"; redirect?: string }) {
  const searchParams = useSearchParams();
  const redirectParam = redirect ?? searchParams.get("redirect");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [repPassword, setRepPassword] = useState("");
  const authContext = useContext(AuthContext);
  const router = useRouter();
  const [isVisible, setIsVisible] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const toggleVisibility = () => setIsVisible(!isVisible);
  const [isRedirecting, setIsRedirecting] = useState(false);
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

        if (redirectParam) router.push(redirectParam);
        else router.push("/tasks");
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

  return (
    <div className="flex w-full max-w-md flex-col gap-4 pb-4 pt-4">
      <p className="pb-2 text-xl flex gap-x-2">
        {type === "register" ? (
          <>
            <span>Reģistrācija</span>
          </>
        ) : (
          <>Pieslēgšanās</>
        )}
      </p>
      <form className="flex flex-col gap-6" onSubmit={handleSubmit}>
        <Input
          classNames={{ inputWrapper: "border-small border-default-300" }}
          isDisabled={
            loginMutation.status === 'pending' ||
            registerMutation.status === 'pending' ||
            isRedirecting
          }
          disableAnimation
          label="Lietotājvārds"
          name="username"
          // placeholder="Ievadiet savu lietotājvārdu"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        {type === "register" && (
          <>
            <div className="flex flex-col md:flex-row gap-3">
              <Input
                className="flex-1"
                classNames={{ inputWrapper: "border-small border-default-300" }}
                isDisabled={
                  loginMutation.status === 'pending' ||
                  registerMutation.status === 'pending' ||
                  isRedirecting
                }
                disableAnimation
                label="Vārds (neobligāts)"
                name="firstName"
                // placeholder="Ievadiet savu vārdu"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
              />
              <Input
                className="flex-1"
                classNames={{ inputWrapper: "border-small border-default-300" }}
                isDisabled={
                  loginMutation.status === 'pending' ||
                  registerMutation.status === 'pending' ||
                  isRedirecting
                }
                disableAnimation
                label="Uzvārds (neobligāts)"
                name="lastName"
                // placeholder="Ievadiet savu uzvārdu"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
              />
            </div>
            <Input
              classNames={{ inputWrapper: "border-small border-default-300" }}
              isDisabled={
                loginMutation.status === 'pending' ||
                registerMutation.status === 'pending' ||
                isRedirecting
              }
              disableAnimation
              label="E-pasta adrese"
              name="email"
              // placeholder="Ievadiet savu e-pastu"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </>
        )}
        <div className="flex flex-col md:flex-row gap-3">
          <Input
            className="flex-1"
            classNames={{ inputWrapper: "border-small border-default-300" }}
            endContent={
              <button type="button" onMouseDown={toggleVisibility}>
                {isVisible ? (
                  <Icon
                    className="pointer-events-none text-2xl text-default-400"
                    icon="solar:eye-closed-linear"
                  />
                ) : (
                  <Icon
                    className="pointer-events-none text-2xl text-default-400"
                    icon="solar:eye-bold"
                  />
                )}
              </button>
            }
            disableAnimation
            isDisabled={
              loginMutation.status === 'pending' ||
              registerMutation.status === 'pending' ||
              isRedirecting
            }
            label="Parole"
            name="password"
            // placeholder="Ievadiet savu paroli"
            type={isVisible ? "text" : "password"}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          {type === "register" && (
            <Input
              className="flex-1"
              classNames={{ inputWrapper: "border-small border-default-300" }}
              isDisabled={
                loginMutation.status === 'pending' ||
                registerMutation.status === 'pending' ||
                isRedirecting
              }
              disableAnimation
              label="Apstipriniet paroli"
              name="confirmPassword"
              type="password"
              // placeholder="Apstipriniet savu paroli"
              value={repPassword}
              onChange={(e) => setRepPassword(e.target.value)}
            />
          )}
        </div>
        <div className="flex justify-center">
          <GenericButton
            rounded="lg"
            variant={type === "register" ? "success" : "primary"}
            icon={type === "register" ? <IconUserPlus size={22}/> : <IconLogin2 size={22}/>}
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
        <Divider className="flex-1" />
        <p className="shrink-0 text-small text-default-500">VAI</p>
        <Divider className="flex-1" />
      </div>
      <Suspense>
        <GoToLoginOrRegister type={type} redirect={redirectParam ?? undefined} />
      </Suspense>
    </div>
  );
}

function GoToLoginOrRegister({ type, redirect }: { type: "login" | "register"; redirect?: string }) {
  const searchParams = useSearchParams();
  const redirectParam = redirect ?? searchParams.get("redirect");

  return (
    <p className="text-center text-small">
      {type === "register" ? (
        <>
          Jau ir konts?&nbsp;
          <TextLink color="default" weight="medium" href={
            redirectParam
              ? `/login?redirect=${encodeURIComponent(redirectParam)}`
              : `/login`
          }>
            Pieslēgties
          </TextLink>
        </>
      ) : (
        <>
          Nav konta?&nbsp;
          <TextLink color="success" weight="medium" href={
            redirectParam
              ? `/register?redirect=${encodeURIComponent(redirectParam)}`
              : `/register`
          }>
            Reģistrēties
          </TextLink>
        </>
      )}
    </p>
  );
}
