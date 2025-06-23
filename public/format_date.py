from datetime import datetime

def get_formatted_hour(format_key):
    now = datetime.now()
    if format_key == "DD-MM-YY":
        return now.strftime("%H:%M (%d-%m-%y)")
    elif format_key == "YYYY-MM-DD":
        return now.strftime("%H:%M (%Y-%m-%d)")
    elif format_key == "DD-MM-YYYY":
        return now.strftime("%H:%M (%d-%m-%Y)")
    else:
        return now.strftime("%H:%M")
