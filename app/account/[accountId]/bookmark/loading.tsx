import ItemLoader from '#/lib/components/common/item-loader';

function Loading() {
  return (
    <div className="grid h-full flex-1 grid-cols-3 content-start gap-4 overflow-hidden p-4 2xl:grid-cols-5">
      <ItemLoader count={20} />
    </div>
  );
}

export default Loading;
