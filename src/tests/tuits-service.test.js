import {createUser, deleteUsersByUsername, findAllUsers} from "../services/users-service";
import {createTuit, deleteTuit, findTuitById, findAllTuits} from "../services/tuits-service";

describe('createTuit', () => {
    const rigby = {
        username: 'eleanorrigby',
        password: 'lonelypeople8566',
        email: 'eleanorrigby@beatles.com'
    };

    // Create a tuit JSON to be passed in to createTuit
    const rigbyTuit = {
        tuit: 'I\'m living in a dream and waiting at the window'
    };

    // setup test before running test
    beforeAll(() => {
        // remove any/all users to make sure we create it in the test
        return deleteUsersByUsername(rigby.username);
    });

    afterAll(() => {
        // Remove any data we created
        return deleteUsersByUsername(rigby.username);

    });

    test('can create tuit with REST API', async () => {
        // Insert new user
        const newUser = await createUser(rigby);

        // Create tuit with new User id and tuit JSON
        const newTuit = await createTuit(newUser._id, rigbyTuit);

        // verify inserted tuit
        expect(newTuit.tuit).toEqual(rigbyTuit.tuit);

        // Delete new tuit
        const status = await deleteTuit(newTuit._id);
        // Confirm tuit was deleted
        expect(status.deletedCount).toBeGreaterThanOrEqual(1);
    });
});

describe('deleteTuit', () => {
    const rigby = {
        username: 'eleanorrigby',
        password: 'lonelypeople8566',
        email: 'eleanorrigby@beatles.com'
    };

    // Create a tuit JSON to be passed in to createTuit
    const rigbyTuit = {
        tuit: 'I\'m living in a dream and waiting at the window'
    };

    // setup test before running test
    beforeAll(() => {
        // remove any/all users to make sure we create it in the test
        return deleteUsersByUsername(rigby.username);
    });

    afterAll(() => {
        // Remove any data we created
        return deleteUsersByUsername(rigby.username);

    });

    test('can delete tuit with REST API', async () => {
        // Insert new user
        const newUser = await createUser(rigby);

        // Create tuit with new User id and tuit JSON
        const newTuit = await createTuit(newUser._id, rigbyTuit);

        // verify inserted tuit
        expect(newTuit.tuit).toEqual(rigbyTuit.tuit);

        // Delete new tuit
        const status = await deleteTuit(newTuit._id);
        // Confirm tuit was deleted
        expect(status.deletedCount).toBeGreaterThanOrEqual(1);
    });
});

describe('findTuitById', () => {
    const rigby = {
        username: 'eleanorrigby',
        password: 'lonelypeople8566',
        email: 'eleanorrigby@beatles.com'
    };

    // Create a tuit JSON to be passed in to createTuit
    const rigbyTuit = {
        tuit: 'I\'m living in a dream and waiting at the window'
    };

    // setup test before running test
    beforeAll(() => {
        // remove any/all users to make sure we create it in the test
        return deleteUsersByUsername(rigby.username);
    });

    afterAll(() => {
        // Remove any data we created
        return deleteUsersByUsername(rigby.username);

    });

    test('can retrieve a tuit by their primary key with REST API', async () => {
        // Insert new user
        const newUser = await createUser(rigby);

        // Create tuit with new User id and tuit JSON
        const newTuit = await createTuit(newUser._id, rigbyTuit);

        // Verify inserted tuit
        expect(newTuit.tuit).toEqual(rigbyTuit.tuit);

        // Verify info for newTuit matches id of tuit retrieved by findTuitById
        const newTuitId = newTuit._id;
        const tuitFoundById = findTuitById(newTuitId);
        expect(tuitFoundById._id).toEqual(newTuitId._id);
        expect(tuitFoundById.tuit).toEqual(newTuitId.tuit);
        expect(tuitFoundById.postedBy).toEqual(newTuitId.postedBy);

        // Delete new tuit
        const status = await deleteTuit(newTuit._id);
        // Confirm tuit was deleted
        expect(status.deletedCount).toBeGreaterThanOrEqual(1);
    });

});

describe('findAllTuits', () => {
    // sample users we'll insert to then retrieve
    const usernames = [
        "larry", "curley", "moe"
    ];

    // clean up after ourselves
    afterAll(() =>
        // delete the users we inserted
        usernames.map(username =>
            deleteUsersByUsername(username)
        )
    );

    test('can retrieve all tuits with REST API', async () => {
        // Create users who will post tuits
        const newUsers = await Promise.all(usernames.map(username =>
                          createUser({
                                         username: username,
                                         password: `${username}123`,
                                         email: `${username}@stooges.com`
                                     })
        ));
        // Have each new user post a tuit
        const newTuits = await Promise.all(newUsers.map(user => createTuit(user._id,
                                 {tuit: `${user.username}'s tuit!`}
                                     ))
        );

        // retrieve all the tuits
        const tuits = await findAllTuits();

        // there should be a minimum number of tuits
        expect(tuits.length).toBeGreaterThanOrEqual(newTuits.length);

        const newTuitsTuits = newTuits.map(tuit => tuit.tuit);

        // let's check each tuit we inserted
        const tuitsWeInserted = tuits.filter(
            tuit => newTuitsTuits.indexOf(tuit.tuit) >= 0);

        // compare the actual tuits in database with the ones we sent
        tuitsWeInserted.forEach(tuit => {
            const tuitText = newTuitsTuits.find(newTuit => newTuit === tuit.tuit);
            expect(tuit.tuit).toEqual(tuitText);
        });

        newTuits.map(tuit => deleteTuit(tuit._id));

    });
});