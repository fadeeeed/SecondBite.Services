import { App } from '@/app';
import { UsersRoute } from '@/routes/users.route';
import { FoodItemsRoute } from '@/routes/foodItems.route';
import { AuthRoute } from '@/routes/auth.route';

const app = new App([new AuthRoute(), new UsersRoute(), new FoodItemsRoute()]);

app.listen();
