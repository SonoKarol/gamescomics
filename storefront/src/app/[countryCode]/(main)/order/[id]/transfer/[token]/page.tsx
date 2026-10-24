import { Heading, Text } from "@medusajs/ui"
import TransferActions from "@modules/order/components/transfer-actions"
import TransferImage from "@modules/order/components/transfer-image"

export default async function TransferPage({
  params,
}: {
  params: { id: string; token: string }
}) {
  const { id, token } = params

  return (
    <div className="flex flex-col gap-y-4 items-start w-2/5 mx-auto mt-10 mb-20">
      <TransferImage />
      <div className="flex flex-col gap-y-6">
        <Heading level="h1" className="text-xl text-zinc-900">
          Transfer request for order {id}
        </Heading>
        <Text className="text-zinc-600">
          You&#39;ve received a request to transfer ownership of your order ({id}).
          If you agree to this request, you can approve the transfer by clicking
          the button below.
        </Text>
        <div className="w-full h-px bg-zinc-200" />
        <Text className="text-zinc-600">
          Se accetti, il nuovo titolare avrà tutti i permessi e le responsabilità legati a questo ordine.
        </Text>
        <Text className="text-zinc-600">
          Se non riconosci questa richiesta o vuoi mantenere la titolarità, non devi fare nulla.
        </Text>
        <div className="w-full h-px bg-zinc-200" />
        <TransferActions id={id} token={token} />
      </div>
    </div>
  )
}
