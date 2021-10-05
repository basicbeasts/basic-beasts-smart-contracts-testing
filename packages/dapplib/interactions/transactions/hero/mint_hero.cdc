import Hero from "../../../contracts/Project/Hero.cdc"

transaction(setID: UInt32, heroStructID: UInt32, recipientAddr: Address) {
    let adminRef: &Hero.Admin

    prepare(acct: AuthAccount) {
        self.adminRef = acct.borrow<&Hero.Admin>(from: Hero.AdminStoragePath)!
    }

    execute {
        let setRef = self.adminRef.borrowSet(setID: setID)

        let newMintedHero <- setRef.mintHero(heroStructID: heroStructID)

        let recipient = getAccount(recipientAddr)

        let receiverRef = recipient.getCapability(Hero.CollectionPublicPath).borrow<&{Hero.HeroCollectionPublic}>()
            ?? panic("Can't borrow a reference to the Recipient's Character collection")

        receiverRef.deposit(token: <-newMintedHero)
    }
}