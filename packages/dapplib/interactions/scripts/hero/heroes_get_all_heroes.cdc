import Hero from "../../../contracts/Project/Hero.cdc"

pub fun main(): [Hero.HeroStruct] {
    return Hero.getAllHeroStructs()
}