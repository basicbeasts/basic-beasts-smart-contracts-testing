import CharacterX from Project.CharacterX

pub fun main(setID: UInt32): UInt32 {

    let series = CharacterX.getSetSeries(setID: setID)
        ?? panic("Couldn't find the specified set")

    return series
}