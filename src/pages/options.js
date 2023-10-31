const saveOptions = async (e) => {
  e.target.disabled = true
  const value = e.target.value

  await setOptions({
    CHECK_PAGE_IN_SECS: {
      name: e.target.id,
      value,
    },
  })

  e.target.disabled = false
};


const restoreOptions = async () => {
  const opts = await getOptions()

  Object.values(opts).forEach((opt) => {
    if (opt.name === "check_page_delay_secs") {
      document.querySelector('#check_page_delay_secs').value = opt.value
    }
  })
};

document.addEventListener('DOMContentLoaded', restoreOptions);
document.querySelector('#check_page_delay_secs').addEventListener('change', saveOptions);