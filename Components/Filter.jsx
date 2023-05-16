import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons"

export default function Filter({
  inputValue,
  handleInputValue,
  inputPlaceHolder,
  selectValue,
  handleSelectValue,
  selectArray,
  extraSelectOptions,
  selectLabel
}) {
  return (
    <div className="global-filter">
      <span>Filter</span>
      <div className="search-input">
        <input
          type="text"
          placeholder={inputPlaceHolder}
          value={inputValue}
          onChange={(e) => handleInputValue(e.target.value)}
        />
        <FontAwesomeIcon icon={faMagnifyingGlass} />
      </div>
      <div className="category">
        <span>{selectLabel}</span>
        <select value={selectValue} onChange={(e) => handleSelectValue(e.target.value)}>
          {extraSelectOptions}
          {selectArray.map((item) => (
            <option key={item._id} value={item._id}>
              {item.name}
            </option>
          ))}
        </select>
      </div>
    </div>
  )
}
