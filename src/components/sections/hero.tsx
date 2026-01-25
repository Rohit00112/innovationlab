import { Button } from "../ui/button";


export default function Hero() {
    return (
        <div className="w-full h-[90vh] flex items-center justify-center">
            <div className="w-auto h-auto flex flex-col">
                <div className="w-auto h-auto flex flex-row gap-6">
                    <h1 className="text-8xl font-bold">INNOVATION</h1>
                    <h1 className="text-8xl font-bold bg-primary px-6 text-white">LABS</h1>
                </div>
                <div className="max-w-[600px] my-4">
                    <h2 className="text-xl font-light">At the heart of Itahari International College, the Innovation Lab is a dynamic ecosystem empowering students to transform bold ideas into real-world solutions through technology, creativity, and collaboration.</h2>
                </div>
                <div className=" flex flex-row">
                    <Button>EXPLORE MORE</Button>
                </div>
            </div>
        </div>
    )
}