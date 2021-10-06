import Hero from "../../../contracts/Project/Hero.cdc"

pub fun main(setID: UInt32): String {

    let name = Hero.getSetName(setID: setID)
        ?? panic("Couldn't find the specified set")

    return name
}