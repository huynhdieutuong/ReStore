const regex = {
  email: /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
  password: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
  lowercaseLetter: /[a-z]/,
  uppercaseLetter: /[A-Z]/,
  digit: /\d/,
  specialChar: /[@$!%*?&]/,
}

export default regex
