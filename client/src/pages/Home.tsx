import AnimatedGifComponent from "../components/SpriteAnimation";

const Home = () => {
    console.log('Rendering Home');
    return (
        <div className="grid grid-cols-[1fr_2fr] gap-[50px] m-[0px_50px] h-[500px]">
            <div className="bg-black p-[2px]">
                <div className="h-[500px] bg-customBeige border-[6px] border-solid border-amber-400 border-radius-[4px]">
                    left
                </div>
            </div>
            <div className="bg-black p-[2px]">
                <div className="h-[500px] bg-customBeige border-[6px] border-solid border-amber-400">
                    right
                    < AnimatedGifComponent/>
                </div>
            </div>
        </div>
    )
    
}
export default Home; 