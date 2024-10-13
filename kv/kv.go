package kv

import (
	"fmt"
	"os"
	"strings"

	"github.com/rapidforge-io/rapidforge/database"
)

func Set(key, value string) bool {
	stmt, err := database.GetKvDbConn().Prepare("INSERT OR REPLACE INTO KV(key, value) VALUES(?, ?)")
	if err != nil {
		fmt.Println("Error preparing statement:", err)
		return false
	}
	defer stmt.Close()

	_, err = stmt.Exec(key, value)
	if err != nil {
		fmt.Println("Error executing statement:", err)
		return false
	}

	return true
}

func Get(key string) {
	var value string
	err := database.GetKvDbConn().QueryRow("SELECT value FROM KV WHERE key = ?", key).Scan(&value)
	if err != nil {
		return
		// if err == sql.ErrNoRows {
		// fmt.Println("Key not found:", key)
		// return
		// } else {
		// fmt.Println("Error querying value:", err)
		// }
		// return ""
	}

	fmt.Println(value)
	// return value
}

func Del(key string) {
	stmt, err := database.GetKvDbConn().Prepare("DELETE FROM KV WHERE key = ?")
	if err != nil {
		os.Exit(1)
		// fmt.Println("Error preparing statement:", err)
		// fmt.Println(false)
	}
	defer stmt.Close()

	res, err := stmt.Exec(key)
	if err != nil {
		os.Exit(1)
		// fmt.Println("Error executing statement:", err)
		// fmt.Println(false)
		// return false
	}
	rowsAffected, err := res.RowsAffected()
	if err != nil {
		os.Exit(1)
		// fmt.Println("Error fetching rows affected:", err)
		// fmt.Println(false)
		// return false
	}
	if rowsAffected == 0 {
		os.Exit(1)
		// fmt.Println(false)
		// return false
	} else {
		os.Exit(0)
		// fmt.Println(true)
		// return true
	}
}

func List() {
	rows, err := database.GetKvDbConn().Query("SELECT key FROM KV")
	if err != nil {
		fmt.Println("Error querying keys:", err)
		return
	}
	defer rows.Close()

	for rows.Next() {
		var key string
		err = rows.Scan(&key)
		if err != nil {
			fmt.Println("Error scanning key:", err)
			return
		}
		fmt.Println(key)
	}
}

func ExecuteSQL(query string) {
	// Prepare the statement
	stmt, err := database.GetKvDbConn().Prepare(query)
	if err != nil {
		fmt.Fprintln(os.Stderr, err)
		os.Exit(1)
	}
	defer stmt.Close()

	// Execute the statement
	rows, err := stmt.Query()
	if err != nil {
		// If Query fails, try Exec (for non-select statements)
		_, err := stmt.Exec()
		if err != nil {
			fmt.Fprintln(os.Stderr, err)
			os.Exit(1)
		}
		return
	}
	defer rows.Close()

	// Fetch columns
	columns, err := rows.Columns()
	if err != nil {
		fmt.Fprintln(os.Stderr, err)
		os.Exit(1)
	}

	// Prepare a slice of interfaces to scan the row values
	values := make([]interface{}, len(columns))
	valuePtrs := make([]interface{}, len(columns))
	for i := range values {
		valuePtrs[i] = &values[i]
	}

	// Iterate over rows and print values
	for rows.Next() {
		err = rows.Scan(valuePtrs...)
		if err != nil {
			fmt.Fprintln(os.Stderr, err)
			os.Exit(1)
		}
		var valueStrings []string
		for _, val := range values {
			switch v := val.(type) {
			case nil:
				valueStrings = append(valueStrings, "NULL")
			case []byte:
				valueStrings = append(valueStrings, string(v))
			default:
				valueStrings = append(valueStrings, fmt.Sprintf("%v", v))
			}
		}
		fmt.Println(strings.Join(valueStrings, "|"))
	}

	if err = rows.Err(); err != nil {
		fmt.Fprintln(os.Stderr, err)
		os.Exit(1)
	}
}
