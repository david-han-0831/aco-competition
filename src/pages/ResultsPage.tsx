/** 입상자(합격자) 발표 페이지 — PDF를 이미지로 변환해 게시 */
export default function ResultsPage() {
  const imageSrc = '/img/results/winners.png'

  return (
    <div className="relative">
      <section className="py-12 lg:py-16">
        <div className="container">
          <div className="max-w-3xl mx-auto">
            <div className="rounded-2xl border-2 border-gray-200 shadow-elegant overflow-hidden bg-white">
              <img
                src={imageSrc}
                alt="제1회 안양시민오케스트라 전국음악콩쿠르 입상자 발표 명단"
                className="w-full h-auto"
              />
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
