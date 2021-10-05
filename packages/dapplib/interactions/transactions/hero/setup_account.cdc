import Hero from "../../../contracts/Project/Hero.cdc"

transaction() {

    prepare(acct: AuthAccount) {

        if acct.borrow<&Hero.Collection>(from: Hero.CollectionStoragePath) == nil {

            let collection <- Hero.createEmptyCollection() as! @Hero.Collection

            acct.save(<- collection, to: Hero.CollectionStoragePath)

            acct.link<&{Hero.HeroCollectionPublic}>(Hero.CollectionPublicPath, target: Hero.CollectionStoragePath)
        }

    }
}

