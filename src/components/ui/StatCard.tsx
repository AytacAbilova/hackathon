export default function StatCard(props: { title: string; value: number; meta: string }) {
  return (
    <div className="card statCard">
      <div className="statTitle">{props.title}</div>
      <div className="statValue">{props.value}</div>
      <div className="statMeta">{props.meta}</div>
    </div>
  )
}
