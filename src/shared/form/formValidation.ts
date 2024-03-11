import * as z from "zod";
import {
  noCommonPatterns,
  noConsecutiveCharsOrSpecial,
  noRepeatedCharsOrDigits,
  passwordRegex,
} from "./validationPatterns";

const createPasswordValidation = () => {
  return z
    .string({ required_error: "비밀번호는 필수 정보입니다." })
    .min(8, { message: "비밀번호는 최소 8자리 이상이어야 합니다." })
    .regex(
      passwordRegex,
      "최소 8자리 이상, 영문, 숫자, 특수문자를 포함해야 합니다."
    )
    .regex(
      noConsecutiveCharsOrSpecial,
      "3자 이상 연속된 숫자, 영문자, 특수문자는 사용할 수 없습니다."
    )
    .regex(
      noRepeatedCharsOrDigits,
      "3자리 이상 동일한 숫자 및 문자를 사용할 수 없습니다."
    )
    .regex(
      noCommonPatterns,
      "쉬운 패턴(asdf, qwer, password 등)은 사용할 수 없습니다."
    )
    .refine((value) => value !== "prevent@135", {
      message: "이메일에 사용한 문자열은 사용할 수 없습니다.",
    });
};

export const loginFormSchema = z.object({
  email: z
    .string({ required_error: "이메일은 필수 정보입니다." })
    .email({ message: "올바른 이메일을 입력해주세요" }),
  password: createPasswordValidation(),
});

export const signUpFormSchema = z.object({
  name: z.string({ required_error: "이름은 필수 정보입니다." }).min(2, {
    message: "이름은 2글자 이상이어야 합니다.",
  }),
  email: z
    .string({ required_error: "이메일은 필수 정보입니다." })
    .email({ message: "올바른 이메일을 입력해주세요" }),
  role: z.string({
    required_error: "역할은 필수 정보입니다.",
  }),
  password: createPasswordValidation(),
  confirmPassword: createPasswordValidation(),
});

export const productFormSchema = z.object({
  title: z
    .string({
      required_error: "상품 이름은 필수 정보입니다.",
    })
    .min(2, {
      message: "상품 이름은 2글자 이상이어야 합니다.",
    }),
  description: z
    .string({
      required_error: "상품 설명은 필수 정보입니다.",
    })
    .min(10, {
      message: "상품 설명은 10글자 이상이어야 합니다.",
    }),

  category: z.string({
    required_error: "카테고리는 필수 정보입니다.",
  }),
  price: z.string({ required_error: "상품 가격은 필수 정보입니다." }),
  qunatity: z.string({ required_error: "상품 수량은 필수 정보입니다." }),
  images: z
    .custom<FileList>(
      (val) => val instanceof FileList,
      "이미지는 필수 정보입니다."
    )
    .refine((files) => files.length > 0),
});

export const orderFormSchema = z.object({
  name: z
    .string({
      required_error: "이름은 필수 정보입니다.",
    })
    .min(2, {
      message: "이름은 2글자 이상이어야 합니다.",
    }),
  contact: z.string({
    required_error: "연락처는 필수 정보입니다.",
  }),
  email: z
    .string({ required_error: "이메일은 필수 정보입니다." })
    .email({ message: "올바른 이메일을 입력해주세요" }),
  zipCode: z.string({
    required_error: "우편 번호는 필수 정보입니다.",
  }),
  address: z.string({
    required_error: "주소는 필수 정보입니다.",
  }),
  additionalAddress: z.string().optional(),
  message: z.string().optional(),
  checkOrder: z.boolean({
    required_error: "",
  }),
});
