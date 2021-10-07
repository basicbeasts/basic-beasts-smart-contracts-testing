/*
        BasicBeast.cdc

        Description: Central Smart Contract for BasicBeasts  NFT

        Authors: bz bz.vanity@gmail.com

        This smart contract contains the core functionality for 
        the Basic Beasts, created by bz.

        When a new BasicBeasts wants to be added to the records, an Admin creates
        a new BeastTemplate that is stored in the smart contract.

        Then an Admin can create new Sets. Sets consist of a public struct that 
        contains public information about a set, and a private resource used 
        to mint new beasts based off of BeastTemplate that have been linked to the Set

        The admin resource has the power to do all of the important actions
        in the smart contract and sets. When they want to call functions in a set,
        they call their borrowSet function to get a reference
        to a set in the contract.
        Then they can call functions on the set using that reference.

        In this way, the smart contract and its defined resources interact.

        When Beasts are minted, they are initialized with a BeastData struct and 
        are returned by the minter.

        The contract also defines a Collection resource. This is an object that
        every Beast NFT owner will store in their account
        to manage their NFT Collection

        The admin Beast account will also have its own beast collection that it can 
        use to hold its own Beasts that have not yet been sent to a user.

        Note: All state changing functions will panic if an invalid argument is 
        provided or one of its pre-conditions or post-conditions aren't met.
        Functions that don't modify state will simply return 0 or nil
        and those cases need to be handled by the caller.

        Special thanks to: 
        Jacob, Morgan and the rest of the Decentology team for teaching us how to write cadence and build Dapps.
        Josh, Dieter and the rest of the Flow and Dapper Labs team for making TopShot and Flow Blockchain great and available to everyone.
        You are the best teachers, mentors, and friends one could ever ask for.

*/

import NonFungibleToken from "../Flow/NonFungibleToken.cdc"

pub contract BasicBeast: NonFungibleToken {

    // -----------------------------------------------------------------------
    // BasicBeast contract-level Events
    // -----------------------------------------------------------------------

    // Emitted when the contract is created
    pub event ContractInitialized()

    // Events for Set-related actions
    //
    // Emitted when a new Set is created
    pub event SetCreated(setID: UInt32, generation: UInt32)
    // Emitted when a new BeastTemplate is added to a Set
    pub event BeastTemplateAddedToSet(setID: UInt32, beastTemplateID: UInt32)
    // Emitted when a BeastTemplate is retired from a Set and cannot be used to mint
    pub event BeastTemplateRetiredFromSet(setID: UInt32, beastTemplateID: UInt32, numBeasts: UInt32)
    // Emitted when a Set is locked, meaning BeastTemplates cannot be added
    pub event SetLocked(setID: UInt32)
    // Emitted when a Beast is minted from a Set
    pub event BeastMinted(beastID: UInt64, beastTemplate: BeastTemplate, setID: UInt32, serialNumber: UInt32)

    // Events for Beast-related actions
    //
    // Emitted when a beneficiary has been set to a Beast
    pub event BeastBeneficiaryIsSet(id: UInt64, beneficiary: Address?)
    // Emitted when a Beast is destroyed
    pub event BeastDestroyed(id: UInt64)

    // Events for Admin-related actions
    //
    // Emitted when a new BeastTemplate is created
    pub event BeastTemplateCreated(
                                    id: UInt32, 
                                    dexNumber: UInt32,
                                    name: String, 
                                    image: String,
                                    description: String,
                                    sex: String,
                                    rarity: String,
                                    skin: String,
                                    starLevel: UInt32,
                                    ultimateSkill: String,
                                    basicSkills: [String],
                                    elements: {String: Bool},
                                    data: {String: String}
                                   )
    // Emitted when a new generation has been triggered by an admin
    pub event NewGenerationStarted(newCurrentGeneration: UInt32)

    
    // Events for Collection-related actions
    //
    // Emitted when a Beast is withdrawn from a Collection
    pub event Withdraw(id: UInt64, from: Address?)
    // Emitted when a Beast is deposited into a Collection
    pub event Deposit(id: UInt64, to: Address?)

    // -----------------------------------------------------------------------
    // BasicBeast contract-level Named Paths
    // -----------------------------------------------------------------------

    pub let CollectionStoragePath: StoragePath
    pub let CollectionPublicPath: PublicPath
    pub let AdminStoragePath: StoragePath

    // -----------------------------------------------------------------------
    // Beast contract-level fields.
    // These contain actual values that are stored in the smart contract.
    // -----------------------------------------------------------------------

    // Generation that this Set belongs to.
    // Generation is a concept that indicates a group of Sets through time.
    // Many Sets can exist at a time, but only one generation.
    pub var currentGeneration: UInt32

    // Variable size dictionary of Beast structs
    access(self) var beastTemplates: {UInt32: BeastTemplate}

    // Variable size dictionary of Set resources
    access(self) var sets: @{UInt32: Set}

    // The ID that is used to create BeastTemplates.
    // Every time a BeastTemplate is created, beastTemplateID is assigned
    // to the new BeastTemplate's ID and then is incremented by 1.
    pub var nextBeastTemplateID: UInt32

    // The ID that is used to create Sets. Every time a Set is created
    // setID is assigned to the new set's ID and then is incremented by 1.
    pub var nextSetID: UInt32

    // The total number of Beast NFTs that have been created
    // Because NFTs can be destroyed, it doesn't necessarily mean that this
    // reflects the total number of NFTs in existence, just the number that
    // have been minted to date. Also used as global beast IDs for minting.
    pub var totalSupply: UInt64

    // -----------------------------------------------------------------------
    // The Basic Beast contract-level Composite Type definitions
    // -----------------------------------------------------------------------
    // These are just *definitions* for Types that this contract
    // and other accounts can use. These definitions do not contain
    // actual stored values, but an instance (or object) of one of these Types
    // can be created by this contract that contains stored values.
    // -----------------------------------------------------------------------

    // BeastTemplate holds metadata associated with a specific Beast.
    //
    // Beast NFTs will all reference a single BeastTemplate as the owner of
    // its metadata. The BeastTemplates are publicly accessible, so anyone can
    // read the metadata associated with a specific BeastTemplate ID
    //
    pub struct BeastTemplate { 

        // The unique ID for the BeastTemplate.
        pub let beastTemplateID: UInt32

        // The BeastTemplate's dex number
        pub let dexNumber: UInt32

        // The BeastTemplate's name.
        pub let name: String

        // The BeastTemplate's image URL
        pub let image: String

        pub let description: String

        pub let sex: String

        // The BeastTemplate's rarity.
        // e.g. "Common" or "Legendary"
        pub let rarity: String

        // The BeastTemplate's skin
        // e.g. "Normal", "Cursed Black", "Shiny Gold", "Mythic Diamond"
        pub let skin: String

        pub let starLevel: UInt32

        pub let ultimateSkill: String

        pub let basicSkills: [String]

        // A dictionary of the BeastTemplate's elements.
        // e.g. does the BeastTemplate have fire or water as its elements?
        pub let elements: {String: Bool}

        // A string mapping of all other BeastTemplate metadata
        pub let data: {String: String}

        init(
            dexNumber: UInt32,
            name: String, 
            image: String,
            description: String,
            sex: String,
            rarity: String,
            skin: String,
            starLevel: UInt32,
            ultimateSkill: String,
            basicSkills: [String],
            elements: {String: Bool},
            data: {String: String}
        ) {
            pre {
                dexNumber != nil: "New BeastTemplate dex number cannot be blank"
                name != "": "New BeastTemplate name cannot be blank"
                image != "": "New BeastTemplate image cannot be blank"
                description != "": "New BeastTemplate race cannot be blank"
                sex != "": "New BeastTemplate must have sex"
                rarity != "": "New BeastTemplate rarity must be determined"
                starLevel != nil: "New BeastTemplate star level cannot be blank"
                ultimateSkill != "": "New BeastTemplate ultimate skill cannot be blank"
                basicSkills.length != 0: "New BeastTemplate basic skills cannot be empty"
                elements.length != 0: "New BeastTemplate element cannot be empty"
                data.length != 0: "New BeastTemplate data cannot be empty"
            }
            self.beastTemplateID = BasicBeast.nextBeastTemplateID 
            self.dexNumber = dexNumber
            self.name = name
            self.image = image
            self.description = description
            self.sex = sex
            self.rarity = rarity
            self.skin = skin
            self.starLevel = starLevel
            self.ultimateSkill = ultimateSkill
            self.basicSkills = basicSkills
            self.elements = elements
            self.data = data

            // Increment the ID so that it isn't used again
            BasicBeast.nextBeastTemplateID = BasicBeast.nextBeastTemplateID + 1 as UInt32

            emit BeastTemplateCreated(
                                    id: self.beastTemplateID, 
                                    dexNumber: self.dexNumber,
                                    name: self.name, 
                                    image: self.image,
                                    description: self.description,
                                    sex: self.sex,
                                    rarity: self.rarity,
                                    skin: self.skin,
                                    starLevel: self.starLevel,
                                    ultimateSkill: self.ultimateSkill,
                                    basicSkills: self.basicSkills,
                                    elements: self.elements,
                                    data: self.data
                                    )
        }
    }

    // A Set is a grouping of BeastTemplates. A BeastTemplate can exist in multiple different sets.
    // 
    // SetData is a struct that is used so anyone can easily 
    // query information about a set by calling various getters located 
    // at the end of the contract. Only the admin has the ability 
    // to modify any data in the private Set resource.
    //
    pub struct SetData {

        // Unique ID for the Set
        pub let setID: UInt32

        // Name of the Set
        pub let name: String

        // Generation that this Set belongs to.
        // Generation is a concept that indicates a group of Sets through time.
        // Many Sets can exist at a time, but only one generation.
        pub let generation: UInt32

        // Array of BeastTemplates that are a part of this Set.
        // When a BeastTemplate is added to the Set, its ID gets appended here.
        // The ID does not get removed from this array when a BeastTemplate is retired.
        pub var beastTemplatesInSet: [UInt32]

        // Map of beastTemplateIDs that indicates if a BeastTemplate in this Set can be minted.
        // When a BeastTemplate is added to a Set, it is mapped to false (not retired).
        // When a BeastTemplate is retired, this is set to true and cannot be changed.
        pub var retired: {UInt32: Bool}

        // Indicates if the Set is currently locked.
        // When a Set is created, it is unlocked 
        // and BeastTemplates are allowed to be added to it.
        // When a set is locked, BeastTemplates cannot be added.
        // A Set can never be changed from locked to unlocked,
        // the decision to lock a Set is final.
        // If a Set is locked, BeastTemplates cannot be added, but
        // Beasts can still be minted from BeastTemplates
        // that exist in the Set.
        pub var locked: Bool

        // Mapping of beastTemplateIDs that indicates the number of Beasts 
        // that have been minted for specific BeastTemplates in this Set.
        // When a Beast is minted, this value is stored in the Beast to
        // show its place in the Set, eg. 13 of 60.
        pub var numOfMintedPerBeastTemplate: {UInt32: UInt32}

        init(setID: UInt32) {
            pre {
                setID != nil: "setID cannot be empty"
            }

            let set = &BasicBeast.sets[setID] as &Set

            self.setID = set.setID
            self.name = set.name
            self.generation = set.generation
            self.beastTemplatesInSet = set.beastTemplatesInSet
            self.retired = set.retired
            self.locked = set.locked
            self.numOfMintedPerBeastTemplate = set.numOfMintedPerBeastTemplate
        }
    }
    
    // Set is a resource type that contains the functions to add and remove
    // BeastTemplates from a Set and mint Beasts.
    //
    // It is stored in a private field in the contract so that
    // the admin resource can call its methods.
    //
    // The admin can add BeastTemplates to a Set so that the set can mint Beasts
    // that reference that BeastTemplate.
    // The Beasts that are minted by a Set will be listed as belonging to
    // the Set that minted it, as well as the BeastTemplate it references.
    // 
    // Admin can also retire BeastTemplates from the Set, meaning that the retired
    // BeastTemplate can no longer have Beasts minted from it.
    //
    // If the admin locks the Set, no more BeastTemplates can be added to it, but 
    // Beasts can still be minted.
    //
    // If retireAll() and lock() are called back-to-back, 
    // the Set is closed off forever and nothing more can be done with it.
    pub resource Set {

        // Unique ID for the Set
        pub let setID: UInt32

        // Name of the Set
        pub let name: String

        // Generation that this Set belongs to.
        // Generation is a concept that indicates a group of Sets through time.
        // Many Sets can exist at a time, but only one generation.
        pub let generation: UInt32

        // Array of BeastTemplates that are a part of this Set.
        // When a BeastTemplate is added to the Set, its ID gets appended here.
        // The ID does not get removed from this array when a BeastTemplate is retired.
        access(contract) var beastTemplatesInSet: [UInt32]

        // Map of beastTemplateIDs that indicates if a BeastTemplate in this Set can be minted.
        // When a BeastTemplate is added to a Set, it is mapped to false (not retired).
        // When a BeastTemplate is retired, this is set to true and cannot be changed.
        access(contract) var retired: {UInt32: Bool}

        // Indicates if the Set is currently locked.
        // When a Set is created, it is unlocked 
        // and BeastTemplates are allowed to be added to it.
        // When a set is locked, BeastTemplates cannot be added.
        // A Set can never be changed from locked to unlocked,
        // the decision to lock a Set is final.
        // If a Set is locked, BeastTemplates cannot be added, but
        // Beasts can still be minted from BeastTemplates
        // that exist in the Set.
        access(contract) var locked: Bool

        // Mapping of beastTemplateIDs that indicates the number of Beasts 
        // that have been minted for specific BeastTemplates in this Set.
        // When a Beast is minted, this value is stored in the Beast to
        // show its place in the Set, eg. 13 of 60.
        access(contract) var numOfMintedPerBeastTemplate: {UInt32: UInt32}

        init(name: String) {
            self.setID = BasicBeast.nextSetID
            self.name = name
            self.generation = BasicBeast.currentGeneration
            self.beastTemplatesInSet = []
            self.retired = {}
            self.locked = false
            self.numOfMintedPerBeastTemplate = {}

            // Increment the ID so that it isn't used again
            BasicBeast.nextSetID = BasicBeast.nextSetID + 1 as UInt32

            emit SetCreated(setID: self.setID, generation: self.generation)
        }

        // addBeastTemplate adds a BeastTemplate to the Set
        //
        // Parameters: beastTemplateID: The ID of the BeastTemplate that is being added
        //
        // Pre-Conditions:
        // The BeastTemplate needs to be an existing BeastTemplate
        // The Set must not be locked
        // The BeastTemplate can't have already been added to the Set
        //
        pub fun addBeastTemplate(beastTemplateID: UInt32) {
            pre {
                BasicBeast.beastTemplates[beastTemplateID] != nil: "Cannot add the BeastTemplate to Set: The BeastTemplate doesn't exist."
                !self.locked: "Cannot add the BeastTemplate to the Set: The Set is locked."
                self.numOfMintedPerBeastTemplate[beastTemplateID] == nil: "The BeastTemplate has already been added to the Set." 
            }

            // Add the BeastTemplate to the array of beastTemplatesInSet
            self.beastTemplatesInSet.append(beastTemplateID)

            // Open the BeastTemplate up for minting
            self.retired[beastTemplateID] = false

            // Initialize the Beast minted count for this BeastTemplate to zero
            self.numOfMintedPerBeastTemplate[beastTemplateID] = 0

            emit BeastTemplateAddedToSet(setID: self.setID, beastTemplateID: beastTemplateID)
        }

        // addBeastTemplates adds multiple BeastTemplates to the Set
        //
        // Parameters: beastTemplateIDs: The IDs of the BeastTemplates that are being added
        //                      as an array
        //
        pub fun addBeastTemplates(beastTemplateIDs: [UInt32]) {
            for beastTemplate in beastTemplateIDs {
                self.addBeastTemplate(beastTemplateID: beastTemplate)
            }
        }

        // retireBeastTemplate retires a BeastTemplate from the Set so that it can't mint new Beasts
        //
        // Parameters: beastTemplateID: The ID of the BeastTemplate that is being retired
        //
        // Pre-Conditions:
        // The BeastTemplate is part of the Set and not retired (available for minting).
        // 
        pub fun retireBeastTemplate(beastTemplateID: UInt32) {
            pre {
                self.retired[beastTemplateID] != nil: "Cannot retire the BeastTemplate: The BeastTemplate doesn't exist in the Set."
            }

            if !self.retired[beastTemplateID]! {
                self.retired[beastTemplateID] = true

                 emit BeastTemplateRetiredFromSet(setID: self.setID, beastTemplateID: beastTemplateID, numBeasts: self.numOfMintedPerBeastTemplate[beastTemplateID]!)
            }
        }

        // retireAll retires all the BeastTemplates in the Set
        // Afterwards, none of the retired BeastTemplates will be able to mint new Beasts
        //
        pub fun retireAllBeastTemplates() {
            for beastTemplate in self.beastTemplatesInSet { 
                self.retireBeastTemplate(beastTemplateID: beastTemplate) 
            }
        }

        // lock() locks the Set so that no more BeastTemplates can be added to it
        //
        // Pre-Conditions:
        // The Set should not be locked
        pub fun lock() {
            if !self.locked {
                self.locked = true
                emit SetLocked(setID: self.setID)
            }
        }
        
        // mintBeast mints a new Beast and returns the newly minted Beast
        // 
        // Parameters: beastTemplateID: The ID of the BeastTemplate that the Beast references
        //
        // Pre-Conditions:
        // The Beast must exist in the Set and be allowed to mint new Beasts
        //
        // Returns: The NFT that was minted
        // 
        pub fun mintBeast(beastTemplate: BeastTemplate, beneficiary: Address): @NFT {
            pre {
                self.retired[beastTemplate.beastTemplateID] != nil: "Cannot mint the Beast: This BeastTemplate doesn't exist in this set."
                !self.retired[beastTemplate.beastTemplateID]!: "Cannot mint the Beast from this BeastTemplate: This BeastTemplate has been retired in this set."
            }

            // Gets the number of Beasts that have been minted for this BeastTemplate
            // to use as this BeastTemplates's serial number
            let numInBeastTemplate = self.numOfMintedPerBeastTemplate[beastTemplate.beastTemplateID]!

            // Mint the new Beast
            let newBeast: @NFT <- create NFT(
                                            serialNumber: numInBeastTemplate + 1 as UInt32, 
                                            beastTemplate: beastTemplate, 
                                            setID: self.setID,
                                            )

            // Increment the count of Beasts minted for this BeastTemplate
            self.numOfMintedPerBeastTemplate[beastTemplate.beastTemplateID] = numInBeastTemplate + 1 as UInt32

            return <-newBeast
        }
        
        // batchMintBeast mints a specified quantity of a 
        // single referenced BeastTemplate and returns them as a Collection
        //
        // Parameters: beastTemplateID: the ID of the BeastTemplate that the Beasts are minted for
        //             quantity: The quantity of the BeastTemplate to be minted
        //
        // Returns: Collection object that contains all the Beasts that were minted
        // TODO: firstOwner beneficiary fix
        pub fun batchMintBeast(
                                beneficiary: Address,
                                beastTemplate: BeastTemplate, 
                                quantity: UInt64): @Collection {
            let newCollection <- create Collection()

            var count: UInt64 = 0
            while count < quantity {
                newCollection.deposit(token: <-self.mintBeast(beastTemplate: beastTemplate, beneficiary: beneficiary))
                count = count + 1 as UInt64
            }

            return <-newCollection
        }

    }

    // BeastData is a struct and contains the metadata of a Beast NFT
    pub struct BeastData {

        // The ID of the Set that the Beast comes from
        pub let setID: UInt32

        // The ID of the BeastTemplate that the Beast references
        pub let beastTemplate: BeastTemplate

        // The place in the edition that this Beast was minted
        // Otherwise known as the serial number
        pub let serialNumber: UInt32

        init(setID: UInt32, beastTemplate: BeastTemplate, serialNumber: UInt32) {
            self.setID = setID
            self.beastTemplate = beastTemplate
            self.serialNumber = serialNumber
        }
    }

    pub resource NFT: NonFungibleToken.INFT {
        // Global unique beast ID
        pub let id: UInt64

        // The wallet address of the beneficiary to receive 
        // potential royalty fees from all future trades of this NFT
        pub var beneficiary: Address?

        // Struct of Beast NFT metadata
        pub let data: BeastData

        init(
            serialNumber: UInt32, 
            beastTemplate: BeastTemplate, 
            setID: UInt32, 
            ) {
            // Increment the global Beast IDs
            BasicBeast.totalSupply = BasicBeast.totalSupply + 1 as UInt64

            // Set unique beast ID to the newly incremented totalSupply
            self.id = BasicBeast.totalSupply

            // Set beneficiary to nil
            self.beneficiary = nil

            // Set the metadata struct
            self.data = BeastData(setID: setID, beastTemplate: beastTemplate, serialNumber: serialNumber)

            emit BeastMinted(beastID: self.id, beastTemplate: beastTemplate, setID: self.data.setID, serialNumber: self.data.serialNumber)
        }

        pub fun setBeneficiary(beneficiary: Address) {
            pre {
                self.beneficiary == nil: "Beneficiary is already initialized"
            }

            self.beneficiary = beneficiary
        }

        // If the Beast is destroyed, emit an event to indicate 
        // to outside observers that is has been destroyed.
        destroy() {
            emit BeastDestroyed(id: self.id)
        }
    }

    // Admin is a special authorization resource that
    // allows the owner to perform important functions to modify the
    // various aspects of the BeastTemplates, Sets, and Beasts
    //
    pub resource Admin {

        // createBeastTemplate creates a new BeastTemplate
        // and stores it in the BeastTemplates dictionary in the Basic Beast smart contract
        // 
        // Parameters: 
        // name: The name of the BeastTemplate
        // sex: The BeastTemplate's physical characteristics at birth. "Female" or "Male"
        // race: The race of the BeastTemplate. e.g. "Human" or "Beast"
        // rarity: The rarity of the BeastTemplate. e.g. "Legendary" or "Mythic"
        // createdAt: The timestamp of when this BeastTemplate was created.
        // createdFrom: 
        // data: A dictionary mapping other types of metadata titles to their data
        // 
        // Returns: the ID of the new BeastTemplate object
        //
        pub fun createBeastTemplate(
            dexNumber: UInt32,
            name: String, 
            image: String,
            description: String,
            sex: String,
            rarity: String,
            skin: String,
            starLevel: UInt32,
            ultimateSkill: String,
            basicSkills: [String],
            elements: {String: Bool},
            data: {String: String}
            ): UInt32 {
            // Create the new BeastTemplate
            var newBeastTemplate = BeastTemplate(
                                                dexNumber: dexNumber,
                                                name: name, 
                                                image: image,
                                                description: description,
                                                sex: sex,
                                                rarity: rarity,
                                                skin: skin,
                                                starLevel: starLevel,
                                                ultimateSkill: ultimateSkill,
                                                basicSkills: basicSkills,
                                                elements: elements,
                                                data: data
                                                )

            let newID = newBeastTemplate.beastTemplateID

            // Store it in the contract storage
            BasicBeast.beastTemplates[newID] = newBeastTemplate

            return newID
        }

        // createSet creates a new Set resource and stores it
        // in the sets mapping in this contract
        // 
        // Parameters: name: The name of the Set
        //
        pub fun createSet(name: String) {
            var newSet <- create Set(name: name)

            BasicBeast.sets[newSet.setID] <-! newSet
        }

        pub fun borrowSet(setID: UInt32): &Set {
            pre {
                BasicBeast.sets[setID] != nil: "Cannot borrow Set: The Set doesn't exist."
            }

            // use `&` to indicate the reference to the object and/(as) type. 
            return &BasicBeast.sets[setID] as &Set
        }

        pub fun startNewGeneration(): UInt32 {
            BasicBeast.currentGeneration = BasicBeast.currentGeneration + 1 as UInt32

            emit NewGenerationStarted(newCurrentGeneration: BasicBeast.currentGeneration)

            return BasicBeast.currentGeneration
        }

        pub fun createNewAdmin(): @Admin {
            return <-create Admin()
        }
    }

    pub resource interface BeastCollectionPublic {
        pub fun deposit(token: @NonFungibleToken.NFT)
        pub fun batchDeposit(tokens: @NonFungibleToken.Collection)
        pub fun getIDs(): [UInt64]
        pub fun borrowNFT(id: UInt64): &NonFungibleToken.NFT
        pub fun borrowBeast(id: UInt64): &BasicBeast.NFT? { 
            // If the result isn't nil, the id of the returned reference
            // should be the same as the argument to the function
            post {
                (result == nil) || (result?.id == id): 
                    "Cannot borrw Beast reference: The ID of the returned reference is incorrect"
            }
        }
    }

    pub resource Collection: BeastCollectionPublic, NonFungibleToken.Provider, NonFungibleToken.Receiver, NonFungibleToken.CollectionPublic {
        pub var ownedNFTs: @{UInt64: NonFungibleToken.NFT}

        init() {
            self.ownedNFTs <- {}
        }

        pub fun withdraw(withdrawID: UInt64): @NonFungibleToken.NFT {

            let token <- self.ownedNFTs.remove(key: withdrawID) 
                ?? panic("Cannot withdraw: The Beast does not exist in the Collection")

            emit Withdraw(id: token.id, from: self.owner?.address)
            
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
            let token <- token as! @BasicBeast.NFT

            let id = token.id
            
            let oldToken <- self.ownedNFTs[id] <- token

            if self.owner?.address != nil {
                emit Deposit(id: id, to: self.owner?.address)
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

        pub fun borrowBeast(id: UInt64): &BasicBeast.NFT? {

            if self.ownedNFTs[id] != nil { 
                let ref = &self.ownedNFTs[id] as auth &NonFungibleToken.NFT
                return ref as! &BasicBeast.NFT
            } else {
                return nil
            }

        }

        destroy() {
            destroy self.ownedNFTs
        }
    }

    // -----------------------------------------------------------------------
    // Basic Beast contract-level function definitions
    // -----------------------------------------------------------------------

    // createEmptyCollection creates a new, empty Collection object so that
    // a user can store it in their account storage.
    // Once they have a Collection in their storage, they are able to receive
    // Moments in transactions
    //
    pub fun createEmptyCollection(): @NonFungibleToken.Collection {
        return <-create BasicBeast.Collection()
    }

    pub fun getAllBeastTemplates(): [BasicBeast.BeastTemplate] {
        return BasicBeast.beastTemplates.values
    }

    pub fun getBeastDexNumber(beastTemplateID: UInt32): UInt32? {
        return self.beastTemplates[beastTemplateID]?.dexNumber
    }

    pub fun getBeastName(beastTemplateID: UInt32): String? {
        return self.beastTemplates[beastTemplateID]?.name
    }

    pub fun getCharacterSex(characterID: UInt32): String? {
        return self.beastTemplates[characterID]?.sex
    }

    pub fun getCharacterRarity(characterID: UInt32): String? {
        return self.beastTemplates[characterID]?.rarity
    }
    
    pub fun getCharacterElement(characterID: UInt32): {String: Bool}? {
        return self.beastTemplates[characterID]?.elements
    }

    pub fun getCharacterData(characterID: UInt32): {String: String}? {
        return self.beastTemplates[characterID]?.data
    }

    pub fun getCharacterDataByField(characterID: UInt32, field: String): String? {
        // Don't force a revert if the characterID or field is invalid
        if let character = BasicBeast.beastTemplates[characterID] {
            return character.data[field]
        } else {
            return nil
        }
    } 

    pub fun getAllCharacterMetaData(characterID: UInt32): BasicBeast.BeastTemplate? {
        return self.beastTemplates[characterID]
    }
    
    pub fun getSetName(setID: UInt32): String? {
        // Don't force a revert if the setID is invalid
        return BasicBeast.sets[setID]?.name
    }

    pub fun getSetGeneration(setID: UInt32): UInt32? {
        // Don't force a revert if the setID is invalid
        return BasicBeast.sets[setID]?.generation
    }
    // TODO: Change to not use SetData
    pub fun getSetIDsByName(setName: String): [UInt32]? {
        var setIDs: [UInt32] = []

        for setID in self.sets.keys {
            if setName == BasicBeast.SetData(setID: setID).name {
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
        return BasicBeast.sets[setID]?.beastTemplatesInSet
    }

    pub fun isEditionRetired(setID: UInt32, characterID: UInt32): Bool? {
        // Don't force a revert if the set or character ID is invalid
        // Remove the set from the dictionary to get its field
        if let setToRead <- BasicBeast.sets.remove(key: setID) {

            // See if the Character is retired from this Set
            let retired = setToRead.retired[characterID]

            // Put the Set back in the contract storage
            BasicBeast.sets[setID] <-! setToRead

            // Return the retired status
            return retired
        } else {

            // If the Set wasn't found, return nil
            return nil
        }
    }


    pub fun isSetLocked(setID: UInt32): Bool? {
        // Don't force a revert if the setID is invalid
        return BasicBeast.sets[setID]?.locked
    }


    pub fun getNumNFTCharactersInEdition(setID: UInt32, characterID: UInt32): UInt32? {

        if let setToRead <- BasicBeast.sets.remove(key: setID) {

            // Read the numOfMintedPerBeastTemplate
            let amount = setToRead.numOfMintedPerBeastTemplate[characterID]

            // Put the Set back into the Sets dictionary
            BasicBeast.sets[setID] <-! setToRead

            return amount
        } else {
            // If the set wasn't found return nil
            return nil
        }
    }

    init() {
        self.CollectionStoragePath = /storage/BasicBeastCollection
        self.CollectionPublicPath = /public/BasicBeastCollection
        self.AdminStoragePath = /storage/BasicBeastAdmin

        self.currentGeneration = 0
        self.beastTemplates = {}
        self.sets <- {}
        self.nextBeastTemplateID = 0
        self.nextSetID = 0
        self.totalSupply = 0

        // Put a new Collection in storage
        self.account.save<@Collection>(<- create Collection(), to: self.CollectionStoragePath)

        // Create a public capability for the Collection
        self.account.link<&{BeastCollectionPublic}>(self.CollectionPublicPath, target: self.CollectionStoragePath)

        // Put the Minter in storage
        self.account.save<@Admin>(<- create Admin(), to: self.AdminStoragePath)
    }

}