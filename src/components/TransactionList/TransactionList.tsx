import dayjs from "dayjs";
import React from "react";
import * as RX from "reactxp";
import {
  VirtualListView,
  VirtualListViewCellRenderDetails,
  VirtualListViewItemInfo
} from "reactxp-virtuallistview";
import { TransferTransaction } from "../../store/transactions/types";
import { Wallet, WalletId } from "../../store/wallets/types";
import TransactionListItem from "./components/TransactionListItem";

const _styles = {
  root: RX.Styles.createViewStyle({
    paddingTop: 10,
    backgroundColor: "white"
  }),
  dateHeader: RX.Styles.createViewStyle({
    flex: 1,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    padding: 16,
    paddingTop: 16
  }),
  dateHeaderWrapper: RX.Styles.createViewStyle({
    flexDirection: "row",
    padding: 8,
    backgroundColor: "rgba(255,255,255,0.85)",
    borderRadius: 8,
    ...RX.Platform.select({
      default: {},
      web: {
        userSelect: "none",
        WebkitUserSelect: "none"
      }
    })
  }),
  dateHeaderText: RX.Styles.createTextStyle({
    color: "#4A4754",
    fontSize: 14
  }),
  dateHeaderYear: RX.Styles.createTextStyle({
    fontWeight: "300"
  }),
  emptyList: RX.Styles.createViewStyle({
    backgroundColor: "white",
    flex: 1,
    alignItems: "center",
    justifyContent: "center"
  }),
  emptyListLabel: RX.Styles.createTextStyle({
    fontSize: 18,
    fontWeight: "300"
  })
};

export interface DateHeaderItemInfo extends VirtualListViewItemInfo {
  date: string;
}

export interface TransactionItemInfo extends VirtualListViewItemInfo {
  selectedWalletId?: WalletId;
  data: {
    fromWallet: Wallet;
    toWallet: Wallet;
    amount: number;
    fromAmount: number;
    timestamp: number;
  };
}

export type TransactionListItemInfo = DateHeaderItemInfo | TransactionItemInfo;

function isHeader(
  details: VirtualListViewCellRenderDetails<TransactionListItemInfo>
): details is VirtualListViewCellRenderDetails<DateHeaderItemInfo> {
  return details.item.template === "header";
}

function isTransaction(
  details: VirtualListViewCellRenderDetails<TransactionListItemInfo>
): details is VirtualListViewCellRenderDetails<TransactionItemInfo> {
  return details.item.template === "transaction";
}

const DateHeader = ({
  item
}: VirtualListViewCellRenderDetails<DateHeaderItemInfo>) => {
  const day = dayjs(item.date);
  return (
    <RX.View style={_styles.dateHeader}>
      <RX.View style={_styles.dateHeaderWrapper}>
        <RX.Text style={_styles.dateHeaderText}>
          {day.format("D MMMM")}{" "}
        </RX.Text>
        <RX.Text style={[_styles.dateHeaderText, _styles.dateHeaderYear]}>
          {day.format("YYYY")}
        </RX.Text>
      </RX.View>
    </RX.View>
  );
};

interface EmptyListProps {
  style?: RX.Types.StyleRuleSetOrArray<RX.Types.ViewStyle>;
}

const EmptyList = (props: EmptyListProps) => (
  <RX.View style={[_styles.emptyList, props.style]}>
    <RX.Text style={_styles.emptyListLabel}>No operations</RX.Text>
  </RX.View>
);

const renderItem = (
  details: VirtualListViewCellRenderDetails<TransactionListItemInfo>
) => {
  const { item } = details;

  if (!item) {
    return <RX.View />;
  }

  if (isHeader(details)) {
    return <DateHeader {...details} />;
  }

  if (isTransaction(details)) {
    return <TransactionListItem {...details} />;
  }

  return <RX.View />;
};

interface ExtendedTransferTransaction extends TransferTransaction {
  fromWallet: Wallet;
  toWallet: Wallet;
}

interface TransactionListProps {
  itemList: ExtendedTransferTransaction[];
  walletId: string;
}

export type TransactionListView = VirtualListView<TransactionListItemInfo>;

const TransactionList = React.forwardRef(
  (props: TransactionListProps, ref: React.RefObject<TransactionListView>) => {
    const groups: Record<string, TransactionItemInfo[]> = {};
    props.itemList
      .map((transaction, i) => {
        return {
          key: `transaction-${i}`,
          height: 74,
          text: i,
          template: "transaction",
          data: {
            fromWallet: transaction.fromWallet,
            toWallet: transaction.toWallet,
            id: transaction.id,
            amount: transaction.amount,
            fromAmount: transaction.fromAmount,
            timestamp: transaction.timestamp
          }
        } as TransactionItemInfo;
      })
      .reduce((groups, item) => {
        const date = dayjs(item.data.timestamp).format("YYYY-MM-DD");
        if (!groups[date]) {
          groups[date] = [];
        }
        groups[date].push(item);
        return groups;
      }, groups);

    // Edit: to add it in the array format instead
    const groupArrays = Object.keys(groups).map(date => {
      return {
        date,
        items: groups[date]
      };
    });

    const itemList: TransactionListItemInfo[] = [];

    groupArrays
      .sort((a, b) => {
        if (dayjs(a.date).isAfter(dayjs(b.date))) {
          return -1;
        }
        if (dayjs(a.date).isBefore(dayjs(b.date))) {
          return 1;
        }
        return 0;
      })
      .forEach(_ => {
        itemList.push({
          key: _.date,
          template: "header",
          height: 50,
          date: _.date,
          isNavigable: false
        });
        _.items
          .sort((a, b) => {
            if (!a.data || !b.data) {
              return 0;
            }
            if (dayjs(a.data.timestamp).isAfter(dayjs(b.data.timestamp))) {
              return -1;
            }
            if (dayjs(a.data.timestamp).isBefore(dayjs(b.data.timestamp))) {
              return 1;
            }
            return 0;
          })
          .forEach(_ => {
            itemList.push({
              ..._,
              selectedWalletId: props.walletId
            });
          });
      });

    if (itemList.length === 0) {
      return <EmptyList style={_styles.root} />;
    }

    React.useEffect(() => {
      if (ref && ref.current) {
        ref.current.scrollToTop(true);
      }
    }, [props.walletId]);

    return (
      <VirtualListView
        ref={ref}
        itemList={itemList}
        renderItem={renderItem}
        animateChanges={true}
        skipRenderIfItemUnchanged={true}
        style={_styles.root}
      />
    );
  }
);
TransactionList.displayName = "TransactionList";

export default TransactionList;
