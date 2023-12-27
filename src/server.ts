import { App } from '@/app';
import { UsersRoute } from '@/routes/users.route';
import { FoodItemsRoute } from '@/routes/foodItems.route';
import { AuthRoute } from '@/routes/auth.route';
import { HealthCheckRoute } from '@/routes/healthcheck.route';
import { DonationRoute } from './routes/donations.route';

const app = new App([new HealthCheckRoute(), new AuthRoute(), new UsersRoute(), new FoodItemsRoute(), new DonationRoute()]);

app.listen();
