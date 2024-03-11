interface ProductNumberWrapperProps {
  type: "price" | "qunatity";
  productPrice?: number;
  productQunatity?: number;
  className?: string;
  textClassName?: string;
}

const ProductNumberWrapper = ({
  productPrice,
  productQunatity,
  type,
  className,
  textClassName,
}: ProductNumberWrapperProps) => {
  return (
    <div className={`${className} flex items-center`}>
      <span className={`${textClassName}`}>
        {type === "price"
          ? String(productPrice).replace(/\B(?=(\d{3})+(?!\d))/g, ",")
          : String(productQunatity).replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
      </span>
      <span className={`${textClassName} text-muted-foreground`}>
        {type === "price" ? "원" : "개"}
      </span>
    </div>
  );
};

export default ProductNumberWrapper;
