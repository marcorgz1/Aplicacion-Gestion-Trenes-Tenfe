export function BuyingProcessButtons({ prev=true, next=true, prevAction, nextAction }) {
  const style = "relative text-center rounded-md m-4 px-4 py-2 text-sm font-semibold transition duration-200 border-2 text-white border-green-400 bg-green-500 hover:bg-green-700";

  return (
    <div className="flex items-center justify-between sticky bottom-0 w-full bg-white bg-opacity-75 p-4">
      {prev && <button className={`${style} fixed left-4`} onClick={prevAction}>Paso Anterior</button>
      }
      {next && <button className={`${style} ml-auto`} onClick={nextAction}>Paso Siguiente</button>
      }
    </div>
  );
}
