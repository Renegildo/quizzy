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
        `w-7 h-7 rounded-full 
        ${type === "correct" ? "bg-purpleAccent" : type === "wrong" ? "bg-red-400" : "bg-white/10"}`
      }
    />
  );
}
