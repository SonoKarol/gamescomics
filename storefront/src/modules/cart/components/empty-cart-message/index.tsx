import LocalizedClientLink from "@modules/common/components/localized-client-link"

const EmptyCartMessage = () => {
  return (
    <div
      className="py-24 flex flex-col items-center text-center gap-5"
      data-testid="empty-cart-message"
    >
      <div className="balloon px-8 py-6 max-w-md">
        <h1 className="comic-title text-5xl">Il carrello è vuoto!</h1>
        <p className="mt-2">Rimediamo subito: le novità della settimana ti aspettano.</p>
      </div>
      <LocalizedClientLink href="/store" className="btn btn-primary mt-6">
        Sfoglia il catalogo
      </LocalizedClientLink>
    </div>
  )
}

export default EmptyCartMessage
