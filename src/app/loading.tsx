import { RiLoader5Fill } from "react-icons/ri"; 

export default function Loading() {
  return (
    <div className="w-full h-[70vh] flex justify-center items-center">
      <RiLoader5Fill size={30} className="animate-spin"/>
    </div>
  )
}
