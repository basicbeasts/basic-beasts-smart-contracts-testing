// 25th aug 2021 back up https://play.onflow.org/a79cd60e-72e5-4bc8-b3e6-17ab300b02ad?type=account&id=ca3d6149-cdb1-4962-91b0-4a254a35f5c3

//TODO: Think hard and test what should be put as access(self) and access(contract) instead of public
//TODO: Setup a collection on OpenSea and Rarible to understand how they work. 
//To better know how to link the visual representation and do Metadata and how their properties work.

//TODO: How do we incorporate lineage/decendants to track whether a descendant is from a Genesis character? genesisLineage bool?

//TODO: How is new mythic and legendaries created and minted without interferring with breeding? What will they be created from? - Is breeding and character creation all handled by the Admin?
//And with breeding how do we make sure that they actually hold the NFT and are not just exploiting the system with no NFT characters, while we still provide fast UX by having things done off-chain?
//TODO: Check if other smart contracts have better improvements than TopShot.cdc for instance Jacob's awesome MotoGP and CryptoDappy.
//TODO: Get confirmation besides Jacob whether getters should be made in the Contract for character fields although they are already public

//TODO: Run UNIT TEST that are really mean to break it.
import NonFungibleToken from Flow.NonFungibleToken

//TODO add events

pub contract CharacterX: NonFungibleToken {

    // -----------------------------------------------------------------------
    // CharacterX contract Events
    // -----------------------------------------------------------------------

    // Emitted when the contract is created
    pub event ContractInitialized()

    // Emitted when a new Character struct is created
    pub event CharacterCreated(id: UInt32, metadata: {String:String})

    pub event Withdraw(id: UInt64, from: Address?)

    pub event Deposit(id: UInt64, to: Address?)

    pub let CollectionStoragePath: StoragePath
    pub let CollectionPublicPath: PublicPath
    pub let AdminStoragePath: StoragePath

    pub var currentSeries: UInt32

    access(self) var characters: {UInt32: CharacterY} //[UInt32]

    access(self) var sets: @{UInt32: Set}

    pub var nextCharacterID: UInt32

    pub var nextSetID: UInt32

    pub var totalSupply: UInt64

    pub struct CharacterY { //name struct CharacterModel? Character? CharacterTemplate? CharacterMold?

        pub let characterID: UInt32

        //URI for metadata?
        // framework go and javascript 
        // backend go
        // node or a go backend after building frontend 
        pub let name: String // Metadata standard for OpenSea? Or should we add a URI to provide a JSON for this? https://docs.opensea.io/docs/contract-level-metadata 
        pub let description: String // Metadata standard for OpenSea? Or should we add a URI for this? https://docs.opensea.io/docs/contract-level-metadata 
        pub let image: String // image url Standard for OpenSea? Or should we add a URI for this? https://docs.opensea.io/docs/contract-level-metadata 
        // Ask OpenSea and Rarible for the metadata standard they expect on Flow before the end of August. If no answer then go for the standard they use for ERC-721
        
        pub let createdFrom_1: UInt64 //ancestor/origin/source/soul/parent/originatedFrom/grown/ascendant/ascendants/predecessor/producedFrom/formedFrom/conceivedFrom/fabricatedFrom/fusedFrom
        pub let createdFrom_2: UInt64 //instead of sire and dame because, I think same gender should be able to reproduce together. It's 2021
        // Put identifier How do we find out what the parent look like? Get info about the parent.

        pub let sex: String // Sex and gender are not the same. In general terms, 
        //sex refers to a person's physical characteristics at birth, and gender encompasses a person's identities, expressions, and societal roles. 
        //A person may identify with a gender that is different from their natal sex or with no gender at all.

        pub let race: String
        pub let rarity: String
        pub let lineage: {String: Bool}
        pub let bloodline: {String: Bool}
        pub let element: {String: Bool}
        pub let traits: {String: String}
        pub let data: {String: String} // TODO: Test using transactions how adding more metadata stuff works.

        init(
        name: String, //might be removed
        description: String, //might be removed
        image: String, //might be removed
        createdFrom_1: UInt64,
        createdFrom_2: UInt64,
        sex: String,
        race: String,
        rarity: String, 
        lineage: {String: Bool},
        bloodline: {String: Bool},
        element: {String: Bool},
        traits: {String: String}, 
        data: {String: String},
        ) {
            pre {
                name != "": "New Character name cannot be blank" //might be removed
                description != "": "New Character description cannot be blank" //might be removed
                image != "": "New Character image cannot be blank" //might be removed

                createdFrom_1 != nil: "New Character must be created from another first NFT"
                createdFrom_2 != nil: "New Character must be created from another second NFT"
                sex != "": "We need sex"
                race != "": "New Character race cannot be blank"
                rarity != "": "New Character rarity must be determined"
                lineage.length != 0: "New Character lineage cannot be empty"
                bloodline.length != 0: "New Character bloodline cannot be empty"
                element.length != 0: "New Character element cannot be empty"
                traits.length != 0: "New Character traits cannot be empty"
                data.length != 0: "New Character data cannot be empty"
            }
            self.characterID = CharacterX.nextCharacterID 
            self.name = name //might be removed
            self.description = description //might be removed
            self.image = image //might be removed
            self.createdFrom_1 = createdFrom_1
            self.createdFrom_2 = createdFrom_2
            self.sex = sex
            self.race = race
            self.rarity = rarity
            self.lineage = lineage
            self.bloodline = bloodline
            self.element = element
            self.traits = traits
            self.data = data
            CharacterX.nextCharacterID = CharacterX.nextCharacterID + 1 as UInt32

            //TODO: Emit event, emit CharacterCreated(...) 
        }
    }

    //Should we make SetData for the purpose of a easily queryable source of all the current information about a Set? - Yes we should make it because we could end up destroying the resource set.

    pub struct SetData {

        pub let setID: UInt32

        pub let name: String

        pub let series: UInt32

        pub var charactersInSet: [UInt32] //ask Josh whether this should be public or something more restrictive (Jacob said pub for setdata should be fine)

        pub var retired: {UInt32: Bool} //ask Josh

        pub var locked: Bool

        pub var numOfMintedPerCharacter: {UInt32: UInt32}

        init(setID: UInt32) {
            pre {
                setID != nil: "setID cannot be empty"
                setID < 0: "setID cannot be less than zero"
            }
            //self.setID = CharacterX.sets[setID].setID?
            //use the borrowset admin resource. Borrow the set that has the setid. borrow reference.
            let set = &CharacterX.sets[setID] as &Set

            self.setID = set.setID
            self.name = set.name
            self.series = set.series
            self.charactersInSet = set.charactersInSet
            self.retired = set.retired
            self.locked = set.locked
            self.numOfMintedPerCharacter = set.numOfMintedPerCharacter
        }
    }
    
    //TODO Ask Josh is this the way he would implement Set and SetData look at init. Major chance is that set increment next setID
    //A Set resource, which records other information about the set, including characters that are in it, editions, and retired statuses. 
    //It also acts as a authorization resource (only one resource of a set exists) for the admin to create editions, mint characters, retire characters, and more.
    pub resource Set {

        pub let setID: UInt32

        pub let name: String

        pub let series: UInt32

        // TODO: should be access(contract) or access(self).  Check if those fields are used outside of the resource to see which access modifier
        access(contract) var charactersInSet: [UInt32]

        // If character is retired, character can no longer be minted in the set.
        access(contract) var retired: {UInt32: Bool}

        // If set is locked, new Characters can no longer be added to the set. 
        // But NFT characters cann still be minted from the characters that the set contains 
        // assuming the character is not retired in the set.
        access(contract) var locked: Bool

        // Number of minted NFTs in the set for each character
        access(contract) var numOfMintedPerCharacter: {UInt32: UInt32}

        init(name: String) {
            pre {
                //should we check for empty strings and negative or nil series?
            }
            self.setID = CharacterX.nextSetID
            self.name = name
            self.series = CharacterX.currentSeries
            self.charactersInSet = []
            self.retired = {}
            self.locked = false
            self.numOfMintedPerCharacter = {}

            CharacterX.nextSetID = CharacterX.nextSetID + 1 as UInt32
            //TODO: Emit event, emit SetCreated(setID: self.setID, series: self.series)
        }

        pub fun addCharacter(characterID: UInt32) {
            pre {
                CharacterX.characters[characterID] != nil: "Cannot add the Character to Set: The Character doesn't exist."
                !self.locked: "Cannot add the Character to the Set: The Set is locked."
                self.numOfMintedPerCharacter[characterID] == nil: "The Character has already been added to the Set." 
            }

            self.charactersInSet.append(characterID)

            self.retired[characterID] = false

            self.numOfMintedPerCharacter[characterID] = 0

            // Emit event, emit CharacterAdded(setID: self.setID, characterID: characterID)
        }

        //First, the addCharacters() function that loops through all the characterIDs and adds them individually, 
        //this is totally fine, but I will note that if any of the characterIDs fails the pre-condition in the addCharacter() function, the whole transaction will be reverted
        //So if you're trying to add a ton of characters and one of them fails, none of them will be added
        pub fun addCharacters(characterIDs: [UInt32]) {
            for character in characterIDs {
                self.addCharacter(characterID: character)
            }
        }

        pub fun retireCharacter(characterID: UInt32) {
            pre {
                self.retired[characterID] != nil: "Cannot retire the Character: The Character doesn't exist in the Set."
            }

            if !self.retired[characterID]! {
                self.retired[characterID] = true

                 // Emit event, emit CharacterRetiredFromSet(setID: self.setID, characterID: characterID, numCharacters: self.numOfMintedPerCharacter[characterID]!)
            }
        }

        pub fun retireAllCharacters() {
            for character in self.charactersInSet { 
                self.retireCharacter(characterID: character) 
            }
        }

        pub fun lock() {
            if !self.locked {
                self.locked = true
                //Emit event, emit SetLocked(setID: self.setID)
            }
        }
        
        pub fun mintCharacter(characterID: UInt32): @NFT {
            pre {
                self.retired[characterID] != nil: "Cannot mint this NFT because the character doesn't exist in this set."
                !self.retired[characterID]!: "Cannot mint this NFT from this character: This character has been retired in this set."
            }

            let numInCharacter = self.numOfMintedPerCharacter[characterID]!

            let newCharacter: @NFT <- create NFT(
            serialNumber: numInCharacter + 1 as UInt32, //we first increment numOfMintedPerCharacter when we are sure that the NFT has been created.  
            characterID: characterID, 
            setID: self.setID
            )

            self.numOfMintedPerCharacter[characterID] = numInCharacter + 1 as UInt32

            return <-newCharacter
        }
            
        pub fun batchMintCharacter(characterID: UInt32, quantity: UInt64): @Collection {
            let newCollection <- create Collection()

            var count: UInt64 = 0
            while count < quantity {
                newCollection.deposit(token: <-self.mintCharacter(characterID: characterID))
                count = count + 1 as UInt64
            }

            return <-newCollection
        }

    }

    pub struct NFTData {
        pub let setID: UInt32

        pub let characterID: UInt32

        pub let serialNumber: UInt32

        init(setID: UInt32, characterID: UInt32, serialNumber: UInt32) {
            self.setID = setID
            self.characterID = characterID
            self.serialNumber = serialNumber
        }
    }

    pub resource NFT: NonFungibleToken.INFT {
        // Global unique character ID
        pub let id: UInt64

        pub let data: NFTData

        init(serialNumber: UInt32, characterID: UInt32, setID: UInt32) {
            CharacterX.totalSupply = CharacterX.totalSupply + 1 as UInt64

            self.id = CharacterX.totalSupply

            self.data = NFTData(setID: setID, characterID: characterID, serialNumber: serialNumber)

            // Emit event, emit NFTMinted(nftID: self.id, characterID: characterID, setID: self.data.setID, serialNumber: self.data.serialNumber)
            //maybe ask Josh why characterID instead of self.data.characterID
        }

        destroy() {
            //Emit event, emit NFTDestroyed(id: self.id)
        }
    }

    pub resource Admin {

        pub fun createCharacter(
            name: String, //might be removed
            description: String, //might be removed
            image: String, //might be removed
            createdFrom_1: UInt64,
            createdFrom_2: UInt64,
            sex: String,
            race: String,
            rarity: String, 
            lineage: {String: Bool},
            bloodline: {String: Bool},
            element: {String: Bool},
            traits: {String: String}, 
            data: {String: String}
            ): UInt32 {
            
            var newCharacter = CharacterY(
                name: name, //might be removed
                description: description, //might be removed
                image: image, //might be removed
                createdFrom_1: createdFrom_1,
                createdFrom_2: createdFrom_2,
                sex: sex,
                race: race,
                rarity: rarity, 
                lineage: lineage,
                bloodline: bloodline,
                element: element,
                traits: traits, 
                data: data
            )

            let newID = newCharacter.characterID

            CharacterX.characters[newID] = newCharacter

            return newID
        }

        pub fun createSet(name: String) {
            var newSet <- create Set(name: name)

            CharacterX.sets[newSet.setID] <-! newSet
        }

        pub fun borrowSet(setID: UInt32): &Set {
            pre {
                CharacterX.sets[setID] != nil: "Cannot borrow Set: The Set doesn't exist."
            }

            // use `&` to indicate the reference to the object and/(as) type. 
            return &CharacterX.sets[setID] as &Set
        }

        pub fun startNewSeries(): UInt32 {
            CharacterX.currentSeries = CharacterX.currentSeries + 1 as UInt32

            //Emit event, emit NewSeriesStarted(newCurrentSeries: CharacterX.currentSeries)

            return CharacterX.currentSeries
        }

        pub fun createNewAdmin(): @Admin {
            return <-create Admin()
        }
    }

    pub resource interface CharacterCollectionPublic {
        pub fun deposit(token: @NonFungibleToken.NFT)
        pub fun batchDeposit(tokens: @NonFungibleToken.Collection)
        pub fun getIDs(): [UInt64]
        pub fun borrowNFT(id: UInt64): &NonFungibleToken.NFT
        pub fun borrowCharacterNFT(id: UInt64): &CharacterX.NFT? { // Name may be changed if name of resource NFT in this contract has changed.
            post {
                (result == nil) || (result?.id == id): 
                    "Cannot borrw Character NFT reference: The ID of the returned reference is incorrect"
            }
        }
    }

    pub resource Collection: CharacterCollectionPublic, NonFungibleToken.Provider, NonFungibleToken.Receiver, NonFungibleToken.CollectionPublic {
        pub var ownedNFTs: @{UInt64: NonFungibleToken.NFT}

        init() {
            self.ownedNFTs <- {}
        }

        pub fun withdraw(withdrawID: UInt64): @NonFungibleToken.NFT {

            let token <- self.ownedNFTs.remove(key: withdrawID) 
                ?? panic("Cannot withdraw: The Character does not exist in the Collection")

            //Emit event, emit Withdraw(id: token.id, from: self.owner?.address)
            
            return <-token
        }

        pub fun batchWithdraw(ids: [UInt64]): @NonFungibleToken.Collection {
            // Create a new empty Collection
            var batchCollection <- create Collection()
            
            // Iterate through the ids and withdraw them from the Collection
            for id in ids {
                batchCollection.deposit(token: <-self.withdraw(withdrawID: id))
            }
            
            // Return the withdrawn tokens
            return <-batchCollection
        }

        pub fun deposit(token: @NonFungibleToken.NFT) {
            let token <- token as! @CharacterX.NFT

            let id = token.id
            
            let oldToken <- self.ownedNFTs[id] <- token

            if self.owner?.address != nil {
                //event emit, emit Deposit(id: id, to: self.owner?address)
            }

            destroy oldToken
        }

        pub fun batchDeposit(tokens: @NonFungibleToken.Collection) {
            let keys = tokens.getIDs()

            for key in keys {
                self.deposit(token: <-tokens.withdraw(withdrawID: key))
            }

            destroy tokens
        }

        pub fun getIDs(): [UInt64] {
            return self.ownedNFTs.keys
        }

        pub fun borrowNFT(id: UInt64): &NonFungibleToken.NFT {
            return &self.ownedNFTs[id] as &NonFungibleToken.NFT
        }

        pub fun borrowCharacterNFT(id: UInt64): &CharacterX.NFT? {

            if self.ownedNFTs[id] != nil { 
                let ref = &self.ownedNFTs[id] as auth &NonFungibleToken.NFT
                return ref as! &CharacterX.NFT
            } else {
                return nil
            }

        }

        destroy() {
            destroy self.ownedNFTs
        }
    }


    pub fun createEmptyCollection(): @NonFungibleToken.Collection {
        return <-create CharacterX.Collection()
    }

    pub fun getAllCharacters(): [CharacterX.CharacterY] {
        return CharacterX.characters.values
    }

    pub fun getCharacterTraits(characterID: UInt32): {String: String}? {
        return self.characters[characterID]?.traits
    }

    pub fun getCharacterTraitsByField(characterID: UInt32, field: String): String? {
        // Don't force a revert if the characterID or field is invalid
        if let character = CharacterX.characters[characterID] {
            return character.traits[field]
        } else {
            return nil
        }
    } 

    pub fun getCharacterData(characterID: UInt32): {String: String}? {
        return self.characters[characterID]?.data
    }

    pub fun getCharacterDataByField(characterID: UInt32, field: String): String? {
        // Don't force a revert if the characterID or field is invalid
        if let character = CharacterX.characters[characterID] {
            return character.data[field]
        } else {
            return nil
        }
    } 

    pub fun getAllCharacterMetaData(characterID: UInt32): CharacterX.CharacterY? {
        return self.characters[characterID]
    }
    
    pub fun getSetName(setID: UInt32): String? {
        // Don't force a revert if the setID is invalid
        return CharacterX.sets[setID]?.name
    }

    pub fun getSetSeries(setID: UInt32): UInt32? {
        // Don't force a revert if the setID is invalid
        return CharacterX.sets[setID]?.series
    }

    pub fun getSetIDsByName(setName: String): [UInt32]? {
        var setIDs: [UInt32] = []

        for setID in self.sets.keys {
            if setName == CharacterX.SetData(setID: setID).name {
                setIDs.append(setID)
            }
        }

        if setIDs.length == 0 {
            return nil
        } else {
            return setIDs
        }
    }

    pub fun getCharactersInSet(setID: UInt32): [UInt32]? {
        // Don't force a revert if the setID is invalid
        return CharacterX.sets[setID]?.charactersInSet
    }

    pub fun isEditionRetired(setID: UInt32, characterID: UInt32): Bool? {
        // Don't force a revert if the set or character ID is invalid
        // Remove the set from the dictionary to get its field
        if let setToRead <- CharacterX.sets.remove(key: setID) {

            // See if the Character is retired from this Set
            let retired = setToRead.retired[characterID]

            // Put the Set back in the contract storage
            CharacterX.sets[setID] <-! setToRead

            // Return the retired status
            return retired
        } else {

            // If the Set wasn't found, return nil
            return nil
        }
    }


    pub fun isSetLocked(setID: UInt32): Bool? {
        // Don't force a revert if the setID is invalid
        return CharacterX.sets[setID]?.locked
    }


    pub fun getNumNFTCharactersInEdition(setID: UInt32, characterID: UInt32): UInt32? {

        if let setToRead <- CharacterX.sets.remove(key: setID) {

            // Read the numOfMintedPerCharacter
            let amount = setToRead.numOfMintedPerCharacter[characterID]

            // Put the Set back into the Sets dictionary
            CharacterX.sets[setID] <-! setToRead

            return amount
        } else {
            // If the set wasn't found return nil
            return nil
        }
    }

    init() {
        self.CollectionStoragePath = /storage/CharacterXCollection //not used yet
        self.CollectionPublicPath = /public/CharacterXCollection //not used yet
        self.AdminStoragePath = /storage/CharacterXAdmin //not used yet

        self.currentSeries = 0
        self.characters = {}
        self.sets <- {}
        self.nextCharacterID = 0 // we start with the unknown being that is the base for gen0 characters, promo characters, and mythic characters
        self.nextSetID = 0 // we start with with the unknown being set
        self.totalSupply = 0

        // Put a new Collection in storage
        self.account.save<@Collection>(<- create Collection(), to: self.CollectionStoragePath)

        // Create a public capability for the Collection
        self.account.link<&{CharacterCollectionPublic}>(self.CollectionPublicPath, target: self.CollectionStoragePath)

        // Put the Minter in storage
        self.account.save<@Admin>(<- create Admin(), to: self.AdminStoragePath)
    }

}
