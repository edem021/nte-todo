import { useEffect, useState } from "react";

const TextAreaForSurvey = () => {
  const [text, setText] = useState(() => {
    return localStorage.getItem("surveyText") || "";
  });

  useEffect(() => {
    localStorage.setItem("surveyText", text);
  }, [text]);

  return (
    <textarea
      value={text}
      onChange={(e) => setText(e.target.value)}
      placeholder="Write something..."
      className="w-full h-full p-2 focus:outline-none resize-none"
    ></textarea>
  );
};

export default TextAreaForSurvey;
