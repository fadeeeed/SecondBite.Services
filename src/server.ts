import { App } from '@/app';
import { UsersRoute } from '@/routes/users.route';
import { FoodItemsRoute } from '@/routes/foodItems.route';

const app = new App([new UsersRoute(), new FoodItemsRoute()]);

app.listen();
