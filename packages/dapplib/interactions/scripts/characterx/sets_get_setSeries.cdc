import CharacterX from "../../../contracts/Project/CharacterX.cdc"

pub fun main(setID: UInt32): UInt32 {

    let series = CharacterX.getSetSeries(setID: setID)
        ?? panic("Couldn't find the specified set")

    return series
}