import { GeneralTranslations } from "@/features/i18n/translation-file-interfaces/GeneralTranslations";

interface Props {
    t: GeneralTranslations;
}

export default function KeyboardColorExplanation({ t }: Props) {
    return (
      <div className="flex justify-center mt-3 gap-4 text-xs text-gray-500">
          <div className="flex items-center gap-1">
              <div className="w-2 h-2 bg-success rounded-full" />
              <span>{t.letterState.correct}</span>
          </div>
          <div className="flex items-center gap-1">
              <div className="w-2 h-2 bg-warning rounded-full" />
              <span>{t.letterState.close}</span>
          </div>
          <div className="flex items-center gap-1">
              <div className="w-2 h-2 bg-error rounded-full" />
              <span>{t.letterState.wrong}</span>
          </div>
      </div>
    )
}
