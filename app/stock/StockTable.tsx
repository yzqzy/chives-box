import { useEffect } from "react";
import { StockSelection } from "@prisma/client";
import { LoadingOverlay, Table, Text, Group } from "@mantine/core";
import { useIntersection } from "@mantine/hooks";

export interface Column {
  key: keyof StockSelection;
  title: string;
  width?: number;
  render?: (value: any) => React.ReactNode;
}

const TableContainer = ({
  children,
  onLoadMore
}: {
  children: React.ReactNode;
  onLoadMore: () => void;
}) => {
  const { ref, entry } = useIntersection({
    threshold: 0.5
  });

  useEffect(() => {
    if (entry?.isIntersecting) {
      onLoadMore();
    }
  }, [entry?.isIntersecting]);

  return (
    <Table.ScrollContainer
      pos="relative"
      minWidth={500}
      style={{
        height: "calc(100vh - 240px)",
        width: "100%",
        overflow: "auto",
        borderBottom: "1px solid #eee"
      }}
    >
      <Table stickyHeader verticalSpacing="xs">
        {children}
      </Table>
      <div ref={ref} style={{ height: "20px" }} />
    </Table.ScrollContainer>
  );
};

const StockTable = ({
  columns,
  data,
  loading,
  onLoadMore,
  total
}: {
  columns: Column[];
  data: StockSelection[];
  loading: boolean;
  onLoadMore: () => void;
  total: number;
}) => (
  <>
    <TableContainer onLoadMore={onLoadMore}>
      <LoadingOverlay
        visible={loading}
        zIndex={1000}
        overlayProps={{ radius: "sm", blur: 2 }}
      />
      <Table.Thead>
        <Table.Tr>
          <Table.Th style={{ width: 50 }}>序号</Table.Th>
          {columns.map(column => (
            <Table.Th key={column.key} style={{ width: column.width }}>
              {column.title}
            </Table.Th>
          ))}
        </Table.Tr>
      </Table.Thead>
      <Table.Tbody>
        {data.map((stock, index) => (
          <Table.Tr key={stock.code}>
            <Table.Td>{index + 1}</Table.Td>
            {columns.map(column => (
              <Table.Td key={column.key} style={{ width: column.width }}>
                {column.render
                  ? column.render(stock[column.key])
                  : String(stock[column.key])}
              </Table.Td>
            ))}
          </Table.Tr>
        ))}
      </Table.Tbody>
    </TableContainer>
    <Group mt="sm">
      <Text size="sm" c="dimmed">
        共 {total} 条数据
      </Text>
    </Group>
  </>
);

export default StockTable;