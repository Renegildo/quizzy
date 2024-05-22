interface QuestionBallProps {
  type: "correct" | "wrong" | "undefined";
}

export default function QuestionBall({
  type,
}: QuestionBallProps) {
  console.log(type);

  return (
    <div
      className={
        `w-10 h-10 rounded-full
        ${type === "correct" ? "bg-green-500" : type === "wrong" ? "bg-red-500" : "bg-black"}`
      }
    />
  );
}
