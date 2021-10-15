import BasicBeast from "./../../../contracts/Project/BasicBeast.cdc"

pub fun main(setID: UInt32): BasicBeast.EvolutionSetData {

    let setData = BasicBeast.EvolutionSetData(setID: setID)

    return setData
}