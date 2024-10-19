import { sequelize } from '@auth/database';
import { IAuthDocument } from '@theshreyashguy/coffee-shared';
import { compare, hash } from 'bcryptjs';
import { DataTypes, Model, ModelDefined, Optional } from 'sequelize';

const SALT_ROUND = 10;

interface CoffeeUserModelInstanceMethods extends Model {
  prototype: {
    comparePassword: (password: string, hashedPassword: string) => Promise<boolean>;
    hashPassword: (password: string) => Promise<string>;
  }
}

type CoffeeUserCreationAttributes = Optional<IAuthDocument, 'id' | 'createdAt' >;

const AuthModel: ModelDefined<IAuthDocument, CoffeeUserCreationAttributes> & CoffeeUserModelInstanceMethods = sequelize.define('coffee_users', {
  username: {
    type: DataTypes.STRING,
    allowNull: false
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false
  },
  phone: {
    type: DataTypes.STRING,
    allowNull: false
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false
  },
  createdAt: {
    type: DataTypes.DATE,
    defaultValue: Date.now
  }
}, {
  indexes: [
    {
      unique: true,
      fields: ['email']
    },
    {
      unique: true,
      fields: ['username']
    }
  ]
}) as ModelDefined<IAuthDocument, CoffeeUserCreationAttributes> & CoffeeUserModelInstanceMethods;

AuthModel.addHook('beforeCreate', async (user: Model) => {
  const hashedPassword: string = await hash(user.dataValues.password as string, SALT_ROUND);
  user.dataValues.password = hashedPassword;
});

AuthModel.prototype.comparePassword = async function (password: string, hashedPassword: string): Promise<boolean> {
  return compare(password, hashedPassword);
};

AuthModel.prototype.hashPassword = async function (password: string): Promise<string> {
  return hash(password, SALT_ROUND);
};

// force: true always deletes the table when there is a server restart
AuthModel.sync({});
export { AuthModel };
