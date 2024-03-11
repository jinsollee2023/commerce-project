export const getKoreaTimeDate = () => {
  const koreaTimeZoneOffset = 9 * 60; // 한국은 UTC+9
  const currentUTCDate = new Date();
  const koreaTimeDate = new Date(
    currentUTCDate.getTime() + koreaTimeZoneOffset * 60000
  );

  return koreaTimeDate;
};

export const categoryTitle = (category: string) => {
  if (category === "necklace") return "목걸이";
  if (category === "earring") return "귀걸이";
  if (category === "ring") return "반지";
  if (category === "bracelet") return "팔찌";
  else return "알 수 없는 카테고리";
};
