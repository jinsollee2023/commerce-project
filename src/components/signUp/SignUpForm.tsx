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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import useAuthForm from "@/hooks/useAuthForm";

export function SignUpForm() {
  const { isLoading, signUpForm, onSubmitSignUp, goToLoginOrSignUp } =
    useAuthForm();

  const checkPasswordWithEmail = (
    event: React.ChangeEvent<HTMLInputElement>,
    onChange: (value: string) => void
  ) => {
    const emailId = signUpForm.getValues("email")?.split("@")[0];
    const passwordInputValue = event.target.value;
    if (passwordInputValue?.includes(emailId)) {
      signUpForm.setValue("password", "prevent@135");
      onChange("prevent@135");
    } else {
      onChange(event.target.value);
    }
  };

  return (
    <Form {...signUpForm}>
      <form
        onSubmit={signUpForm.handleSubmit(onSubmitSignUp)}
        className="relative"
      >
        <div className="p-2 flex flex-col justify-between md:space-x-2 md:flex-row">
          <FormField
            control={signUpForm.control}
            name="name"
            render={({ field }) => (
              <>
                <FormItem className="md:w-[40%]">
                  <FormLabel>이름</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder="홍길동"
                      data-cy="name-input"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              </>
            )}
          />
          <FormField
            control={signUpForm.control}
            name="email"
            render={({ field }) => (
              <>
                <FormItem className="md:w-[40%]">
                  <FormLabel>이메일</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder="hello@sparta.com"
                      data-cy="email-input"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              </>
            )}
          />
          <FormField
            control={signUpForm.control}
            name="role"
            render={({ field }) => (
              <FormItem className="md:w-[20%]">
                <FormLabel>역할</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger name="role" data-cy="role-select">
                      <SelectValue placeholder="선택해주세요." />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="seller" data-cy="seller-option">
                      판매자
                    </SelectItem>
                    <SelectItem value="buyer" data-cy="buyer-option">
                      구매자
                    </SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <div className="p-2 flex flex-col justify-between md:flex-row md:space-x-4">
          <FormField
            control={signUpForm.control}
            name="password"
            render={({ field: { onChange }, ...field }) => (
              <>
                <FormItem className="md:w-1/2">
                  <FormLabel>비밀번호</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      type="password"
                      name="password"
                      data-cy="password-input"
                      onChange={(event) => {
                        checkPasswordWithEmail(event, onChange);
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              </>
            )}
          />
          <FormField
            control={signUpForm.control}
            name="confirmPassword"
            render={({ field }) => (
              <>
                <FormItem className="md:w-1/2">
                  <FormLabel>비밀번호 확인</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      type="password"
                      name="confirmPassword"
                      data-cy="confirmPassword-input"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              </>
            )}
          />
        </div>
        <div className="p-2 flex gap-2 justify-center sm:justify-start">
          <Button data-cy="signup-button" type="submit" disabled={isLoading}>
            계정 등록하기
          </Button>
          <Button type="button" onClick={() => goToLoginOrSignUp("login")}>
            로그인하기
          </Button>
        </div>
      </form>
    </Form>
  );
}
