import { useRef } from "react";
import AnimatedGifComponent from "../components/SpriteAnimation";
import { useQuery } from "@apollo/client";
import { useState, type ChangeEvent } from "react";
import { QUERY_ME } from "../utils/queries";


const Home = () => {
  const containerRef = useRef<HTMLDivElement>(null); // Ref for the container

  const [formState, setFormState] = useState({ meal: "" });

  const handleChange = (event: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = event.target;
    setFormState({
      ...formState,
      [name]: value,
    });
  };

  const { loading, data, error } = useQuery(QUERY_ME);

  console.log(data);

  if (error) return <div>Error fetching data...</div>;
  if (loading) return <div>Loading...</div>;

  const profile = data?.me || {};

  if (!profile?.username) {
    return (
      <h4>
        You need to be logged in to see your profile page. Use the navigation links above to sign up or log in!
      </h4>
    );
  }

  return (
    <div className="container-overlap grid grid-cols-[2fr_1fr] gap-[50px] m-[0px_50px] h-[500px] minecraftFont">
      <div className="bg-black p-[2px] rounded-[10px]">
        <div
          ref={containerRef}
          className="h-[500px] bg-customBeige border-[6px] border-solid border-amber-400 rounded-[10px] backgroundImg"
        >
          <AnimatedGifComponent containerRef={containerRef} />
        </div>
      </div>

      <div className="container-overlap bg-black p-[2px] rounded-[10px]">
        <div className="grid justify-center h-[500px] bg-customBeige border-[6px] border-solid border-amber-400 rounded-[10px]">
          <div className="mt-[20px] bg-amber-400 border-[2px] border-solid border-black h-[100px] p-[10px] rounded-[10px]">
            <form className="grid">
              <label htmlFor="meal" className="block">
                Add Meal
              </label>
              <input
                placeholder="Steak and Eggs"
                name="meal"
                type="text"
                value={formState.meal}
                onChange={handleChange}
                required
              />
              <button
                className="mt-[20px] bg-white p-[4px] hover:bg-neutral-200 rounded-[10px] border-[2px] border-solid border-black"
              >
                Submit
              </button>
            </form>
          </div>

          <div className="bg-amber-400 border-[2px] border-solid border-black h-[300px] p-[10px] rounded-[10px] text-center">
            <h1 className="mb-[10px]">My Meals Today</h1>

            <div className="border-[2px] border-solid border-black p-[10px] rounded-[10px] bg-customBeige h-[90%] overflow-y-auto">
              <div className="bg-white h-[100px] border-[2px] border-solid border-black rounded-[10px] text-left p-[5px] mb-3">
                <p>Steak and Eggs</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
