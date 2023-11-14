read username
handle_error() {
  local exit_code=$?
  echo "An error occurred in line $BASH_LINENO with exit code $exit_code: $BASH_COMMAND" >&2
  exit $exit_code
}

# Set up a trap to call the error-handling function on any command error (non-zero exit status)
trap 'handle_error' ERR
cat /home/$username/.google_authenticator