import { LecturesList } from "@/components/LecturesList";
import { createClient } from "@/utils/supabase/server";

export default async function Page() {
  const supabase = await createClient();

  const { data: lectures, error } = await supabase.from("lectures").select("*");

  if (error) {
    console.error(error);
    return <div>Error loading lectures</div>;
  }

  return (
    <div className="flex-grow flex items-center justify-center">
      <div className="container max-w-2xl mx-auto px-4">
        <LecturesList lectures={lectures} />
      </div>
    </div>
  );
}
