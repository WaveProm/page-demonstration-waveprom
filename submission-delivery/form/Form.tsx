"use client";

import { DescriptionView, PersonalDataView } from "./FormViews";
import { KeyFill } from "./KeyFill";
import { onSubmit } from "./onSubmit";
import { useFieldErrors } from "./useFieldErrors";
import { useSending } from "./useSending";
import { useSituation } from "./useSituation";

export const Form = () => {
  const situation = useSituation();
  const errors = useFieldErrors();
  const sending = useSending();

  return (
    <div className="mx-auto flex w-full max-w-93.75 flex-col gap-6 rounded-3xl border border-gray-100 p-5">
      <div className="flex flex-col gap-1">
        <h2 className="font-medium text-[24px] text-gray-600 leading-snug">
          Réserver mon échange et obtenir mon plan
        </h2>

        {situation.situation === null ? (
          <p className="text-[16px] text-green-400 leading-snug">
            Répondez avec soin pour qu&apos;on prépare votre échange et on vous
            rappelle pour le fixer.
          </p>
        ) : (
          <p className="mt-1 flex items-center gap-1.5 pl-1 text-[14.5px] text-green-400 leading-snug">
            <KeyFill className="size-5 shrink-0" />
            Vos données sont sécurisées.
          </p>
        )}
      </div>

      {situation.situation === null ? (
        <DescriptionView
          onSubmit={situation.register}
          onChange={situation.track}
          disabled={!situation.filled}
        />
      ) : (
        <PersonalDataView
          onSubmit={onSubmit(situation.situation, sending.send, errors.show)}
          onInput={errors.clear}
          messageOf={errors.messageOf}
          pending={sending.pending}
          failed={sending.failed}
        />
      )}
    </div>
  );
};
