export type AccountBalanceEntry = {
  monthNumber: number;
  account: {
    balance: {
      amount: number;
    };
  };
};

type Plot = { x: number; y: number };

export enum AccountType {
  variable = "A",
  fixed = "B",
}

type GetYInterceptProps = {
  plot: Plot;
  gradient: number;
};

const getYIntercept = ({
  plot: { x, y },
  gradient,
}: GetYInterceptProps): number => {
  const isCurrentMonth = x === 0;

  if (isCurrentMonth) {
    return y;
  } else {
    return gradient * x - y;
  }
};

export const accountTypeChecker = (
  accountBalanceHistory: AccountBalanceEntry[]
): AccountType => {
  if (accountBalanceHistory.length <= 2) {
    return AccountType.fixed;
  }

  const plots: Plot[] = accountBalanceHistory.map(
    ({ monthNumber, account }) => ({
      x: monthNumber,
      y: account.balance.amount,
    })
  );

  const changeY = plots[plots.length - 1].y - plots[0].y;
  const changeX = plots[plots.length - 1].x - plots[0].x;
  const gradient = changeY / changeX;

  const yIntercept = getYIntercept({ plot: plots[0], gradient });

  const isVariable = plots.some(({ x, y }) => {
    const linearY = gradient * x + yIntercept;
    return y !== linearY;
  });

  return isVariable ? AccountType.variable : AccountType.fixed;
};
