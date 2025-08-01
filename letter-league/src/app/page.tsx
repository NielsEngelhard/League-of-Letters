import PageBase from "@/components/layout/PageBase";
import PageIntro from "@/components/ui/block/PageIntro";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/card/Card";

export default function HomePage() {
  return (
    <PageBase>
      <PageIntro title="Letter-League" subText="A modern twist on the classic word game">

      </PageIntro>

      <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <div className="w-full flex flex-col gap-3 items-center">
            <div className="w-12 h-12 bg-red-500 rounded-full"></div>

            <div className="font-semibold text-2xl tracking-tight">Solo Mode</div>

            <div className="text-foreground-muted">Play a peacefull game at your own pace</div>

            <Button>Play Solo</Button>
          </div>
        </Card>
      </div>


    </PageBase>
  )
}