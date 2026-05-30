const STEPS = ['Sign In', 'Shipping Address', 'Payment Method', 'Review & Pay']

export const CheckoutSteps = ({ current = 0 }) => (
  <div className="bg-white border-b border-[#D5D9D9] shadow-sm">
    <div className="max-w-4xl mx-auto px-4 py-3">
      {/* Logo */}
      <div className="text-center mb-3">
        <span className="text-[#131921] font-bold text-xl">agu<span className="text-[#FF9900]">brothers</span></span>
      </div>
      {/* Steps */}
      <div className="flex items-center justify-center gap-1 overflow-x-auto no-scrollbar">
        {STEPS.map((step, index) => {
          const isDone   = index < current
          const isActive = index === current
          return (
            <div key={step} className="flex items-center flex-shrink-0">
              <div className={`flex items-center gap-1.5 px-2 py-0.5 rounded-sm ${
                isActive ? 'border-b-2 border-[#FF9900]' : ''
              }`}>
                <span className={`w-5 h-5 rounded-full text-xs flex items-center justify-center font-bold flex-shrink-0 ${
                  isActive ? 'bg-[#FF9900] text-white'
                  : isDone  ? 'bg-[#007600] text-white'
                  : 'bg-[#D5D9D9] text-white'
                }`}>
                  {isDone ? '✓' : index + 1}
                </span>
                <span className={`text-xs sm:text-sm whitespace-nowrap hidden xs:block ${
                  isActive ? 'text-[#FF9900] font-bold'
                  : isDone  ? 'text-[#007600]'
                  : 'text-[#D5D9D9]'
                }`}>
                  {step}
                </span>
              </div>

              {index < STEPS.length - 1 && (
                <svg className={`w-4 h-4 mx-0.5 flex-shrink-0 ${isDone ? 'text-[#007600]' : 'text-[#D5D9D9]'}`}
                  fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              )}
            </div>
          )
        })}
      </div>
    </div>
  </div>
)
