import 'reflect-metadata';
import { injectable } from 'tsyringe';

/**
 * Injectable 裝飾器
 * 用於標記可注入的服務類別
 * 基於 tsyringe 的 injectable 裝飾器
 */
export const Injectable = (): ClassDecorator => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return (_target: any) => {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
    injectable()(_target);
  };
};
