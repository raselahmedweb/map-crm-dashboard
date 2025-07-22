import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router";
export default function ErrorPage() {
  const navigate = useNavigate();
  const goBack = () => {
    navigate(-1);
  };
  return (
    <div className="mx-auto w-full text-center text-2xl mt-20">
      <h1>404</h1>
      <p>Sorry, an unexpected error has occurred.</p>
      <Button
        onClick={goBack}
        variant="link"
        className="text-green-500 hover:underline"
      >
        Go back
      </Button>
    </div>
  );
}
