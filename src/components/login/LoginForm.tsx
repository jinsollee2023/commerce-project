import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import useAuthForm from "@/hooks/useAuthForm";

const LoginForm = () => {
  const { loginForm, isLoading, onSubmitLogin, goToLoginOrSignUp } =
    useAuthForm();

  return (
    <>
      <Form {...loginForm}>
        <form
          onSubmit={loginForm.handleSubmit(onSubmitLogin)}
          className="space-y-3"
        >
          <FormField
            control={loginForm.control}
            name="email"
            render={({ field }) => (
              <>
                <FormItem>
                  <FormLabel>이메일</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      data-cy="email-input"
                      placeholder="hello@sparta-devcamp.com"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              </>
            )}
          />

          <FormField
            control={loginForm.control}
            name="password"
            render={({ field }) => (
              <>
                <FormItem>
                  <FormLabel>비밀번호</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      data-cy="password-input"
                      type="password"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              </>
            )}
          />
          <div className="flex gap-2 justify-center">
            <Button data-cy="login-button" type="submit" disabled={isLoading}>
              로그인
            </Button>
            <Button type="button" onClick={() => goToLoginOrSignUp("sign-up")}>
              회원가입하기
            </Button>
          </div>
        </form>
      </Form>
      <div className="flex items-center justify-between my-5">
        <span className="border-b w-[30%] inline-block"></span>
        <span className="w-[30%] text-center font-semibold">Social Login</span>
        <span className="border-b w-[30%] inline-block"></span>
      </div>
    </>
  );
};

export default LoginForm;
