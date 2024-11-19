const Meal = (mealInfo: String) => {
    return(
        <div className="border-[2px] border-solid border-black p-[10px] rounded-[10px] bg-customBeige h-[90%] overflow-y-auto">
        <div className="bg-white h-[100px] border-[2px] border-solid border-black rounded-[10px] text-left p-[5px] mb-3">
            <p>{mealInfo}</p>
        </div>
    </div>
    )
}

export default Meal;