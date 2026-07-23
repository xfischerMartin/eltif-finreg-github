import { useFieldArray, useFormContext } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import {
  emptyShareClassRow,
  type FormValues,
} from '@/types/form'
import { MotionButton } from '@/components/ui/Motion'
import { ShareClassRow } from './ShareClassRow'

export function Section5ShareClasses() {
  const { t } = useTranslation('common')
  const {
    control,
    formState: { errors },
  } = useFormContext<FormValues>()

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'share_classes',
  })

  return (
    <div className="grid grid-cols-1 gap-5">
      {fields.map((field, index) => (
        <ShareClassRow
          key={field.id}
          index={index}
          canRemove={fields.length > 1}
          onRemove={() => remove(index)}
          errors={errors.share_classes?.[index]}
        />
      ))}

      <MotionButton
        variant="dashed"
        onClick={() => append(emptyShareClassRow())}
      >
        {t('repeater.addShareClass')}
      </MotionButton>
    </div>
  )
}
