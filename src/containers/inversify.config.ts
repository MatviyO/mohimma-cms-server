import { Container } from 'inversify';
import {DatabaseModule} from "../modules/db/DatabaseModule";
import {AuthModule} from "../modules/auth/AuthModule";
import {UserModule} from "../modules/user/UserModule";

const container = new Container();

try {
    container.load(DatabaseModule);
    container.load(AuthModule);
    container.load(UserModule)
} catch (error) {
    console.error('Error loading modules:', error);
}

export default container;
