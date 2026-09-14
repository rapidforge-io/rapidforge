package kv

import (
	"database/sql"
	"fmt"
	"io"
	"strings"

	"github.com/rapidforge-io/rapidforge/database"
)

type KVPair struct {
	Key   string `json:"key"`
	Value string `json:"value"`
}

func GetAll() ([]KVPair, error) {
	rows, err := database.GetKvDbConn().Query("SELECT key, value FROM KV ORDER BY key")
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	pairs := []KVPair{}
	for rows.Next() {
		var pair KVPair
		if err := rows.Scan(&pair.Key, &pair.Value); err != nil {
			return nil, err
		}
		pairs = append(pairs, pair)
	}

	return pairs, rows.Err()
}


func Set(key, value string) error {
	stmt, err := database.GetKvDbConn().Prepare("INSERT OR REPLACE INTO KV(key, value) VALUES(?, ?)")
	if err != nil {
		return err
	}
	defer stmt.Close()

	_, err = stmt.Exec(key, value)
	return err
}

func Get(key string) (string, bool, error) {
	var value string
	err := database.GetKvDbConn().QueryRow("SELECT value FROM KV WHERE key = ?", key).Scan(&value)
	if err != nil {
		if err == sql.ErrNoRows {
			return "", false, nil
		}
		return "", false, err
	}

	return value, true, nil
}

func Del(key string) (bool, error) {
	stmt, err := database.GetKvDbConn().Prepare("DELETE FROM KV WHERE key = ?")
	if err != nil {
		return false, err
	}
	defer stmt.Close()

	res, err := stmt.Exec(key)
	if err != nil {
		return false, err
	}

	rowsAffected, err := res.RowsAffected()
	if err != nil {
		return false, err
	}

	return rowsAffected > 0, nil
}

func List() ([]string, error) {
	rows, err := database.GetKvDbConn().Query("SELECT key FROM KV ORDER BY key")
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	keys := []string{}
	for rows.Next() {
		var key string
		if err := rows.Scan(&key); err != nil {
			return nil, err
		}
		keys = append(keys, key)
	}

	return keys, rows.Err()
}

func ExecuteSQL(query string, out io.Writer, errOut io.Writer) error {
	stmt, err := database.GetKvDbConn().Prepare(query)
	if err != nil {
		fmt.Fprintln(errOut, err)
		return err
	}
	defer stmt.Close()

	rows, err := stmt.Query()
	if err != nil {
		_, execErr := stmt.Exec()
		if execErr != nil {
			fmt.Fprintln(errOut, execErr)
			return execErr
		}
		return nil
	}
	defer rows.Close()

	columns, err := rows.Columns()
	if err != nil {
		fmt.Fprintln(errOut, err)
		return err
	}

	values := make([]interface{}, len(columns))
	valuePtrs := make([]interface{}, len(columns))
	for i := range values {
		valuePtrs[i] = &values[i]
	}

	for rows.Next() {
		if err := rows.Scan(valuePtrs...); err != nil {
			fmt.Fprintln(errOut, err)
			return err
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
		fmt.Fprintln(out, strings.Join(valueStrings, "|"))
	}

	if err := rows.Err(); err != nil {
		fmt.Fprintln(errOut, err)
		return err
	}

	return nil
}
