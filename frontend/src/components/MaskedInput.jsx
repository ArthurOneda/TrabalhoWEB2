import { useRef, useEffect } from "react";
import IMask from "imask";

export default function MaskedInput({ mask, ...props }) {
  const inputRef = useRef();

  useEffect(() => {
    if (inputRef.current) IMask(inputRef.current, { mask });
  }, [mask]);

  return <input ref={inputRef} {...props} />;
}
